import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Schema } from "./entities/schema.entity";
import { Repository } from "typeorm";
import { TagService } from "./tag.service";

class SchemaRelations {
  groups = false;
  tags = false;
  drive = false;
}

@Injectable()
export class SchematicsService {
  constructor(
    @InjectRepository(Schema) private schemaRepo: Repository<Schema>,
    @Inject(forwardRef(() => TagService))
    private tagService: TagService
  ) {}

  defaultRelations = new SchemaRelations();

  async getSchemaById(schemaId: string, relations = this.defaultRelations) {
    const schema = await this.schemaRepo.findOne({
      where: { id: schemaId },
      relations,
    });

    return schema;
  }

  async getSchemaByIdDrive(
    schemaId: string,
    drive: any,
    relations = this.defaultRelations
  ) {
    const schema = await this.schemaRepo.findOne({
      where: { id: schemaId, drive },
      relations,
    });
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    return schema;
  }

  async getAllSchema(relations = this.defaultRelations) {
    return await this.schemaRepo.find({ relations });
  }

  async getAllSchemaDrive(drive: any, relations = this.defaultRelations) {
    return await this.schemaRepo.find({ where: { drive }, relations });
  }

  async createSchema(name: string) {
    const schema = this.schemaRepo.create({ name });
    return await this.schemaRepo.save(schema);
  }

  async createSchemaDrive(name: string, drive: any) {
    const schema = this.schemaRepo.create({ drive, name });
    return await this.schemaRepo.save(schema);
  }

  async deleteSchema(schemaId: string) {
    const schema = await this.schemaRepo.findOne({ where: { id: schemaId } });
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    return await this.schemaRepo.delete(schema);
  }

  async deleteSchemaDrive(schemaId: string, drive: any) {
    const schema = await this.schemaRepo.findOne({
      where: { id: schemaId, drive },
    });
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    return await this.schemaRepo.delete(schema);
  }

  async updateSchemaDrive(
    schemaId: string,
    drive: any,
    options: { name?: string; tags?: string[]; groups?: string[] }
  ) {
    if (!(options.name || options.tags || options.groups)) return;
    const schema = await this.schemaRepo.findOne({
      where: { id: schemaId, drive },
      relations: {
        tags: Boolean(options.tags),
        groups: Boolean(options.groups),
      },
    });
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    if (options.name) schema.name = options.name;
    if (options.tags) {
      const tags = [];
      options.tags.forEach(async (tagId) => {
        const tag = await this.tagService.getTagByIdDrive(tagId, drive);
        if (!tag)
          throw new BadRequestException(`tag with id ${tagId} not found`);
        tags.push(tag);
      });
      schema.tags = tags;
    }
    return await this.schemaRepo.save(schema);
  }
}
