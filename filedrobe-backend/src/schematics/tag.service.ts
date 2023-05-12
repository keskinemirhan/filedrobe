import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { Repository } from "typeorm";
import { SchematicsService } from "./schematics.service";

class TagRelations {
  drive? = false;
}

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @Inject(forwardRef(() => SchematicsService))
    private schematicsService: SchematicsService
  ) {}

  defaultRelations = new TagRelations();

  async getTagByIdDrive(
    tagId: string,
    drive: any,
    relations = this.defaultRelations
  ) {
    const tag = await this.tagRepo.findOne({
      where: { id: tagId, drive },
      relations,
    });
    if (!tag) throw new BadRequestException(`tag with id ${tagId} not found`);
    return await tag;
  }

  async getAllTagByDrive(drive: any, relations = this.defaultRelations) {
    const tags = await this.tagRepo.find({ where: { drive }, relations });
    return await tags;
  }

  async getAllTagBySchema(
    schemaId: string,
    drive: any,
    relations = this.defaultRelations
  ) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      schemaId,
      drive,
      {
        tags: true,
        drive: false,
        groups: false,
      }
    );
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    const tags = [];
    await schema.tags.forEach(async (tag) => {
      const found = await this.tagRepo.findOne({
        where: { id: tag.id },
        relations,
      });
      tags.push(found);
    });
    return tags;
  }

  async createTag(
    name: string,
    color: string,
    description: string,
    drive: any
  ) {
    const tag = this.tagRepo.create({ name, color, description, drive });
    return await this.tagRepo.save(tag);
  }

  async updateTagDrive(
    tagId: string,
    drive: any,
    options: { name?: string; color?: string; description?: string }
  ) {
    const tag = await this.tagRepo.findOne({ where: { id: tagId, drive } });
    if (!tag) throw new BadRequestException(`tag with id ${tagId} not found`);
    if (options.name) tag.name = options.name;
    if (options.color) tag.color = options.color;
    if (options.description) tag.description = options.description;
    return await this.tagRepo.save(tag);
  }

  async deleteTagDrive(tagId: string, drive: any) {
    const tag = await this.tagRepo.findOne({ where: { id: tagId, drive } });
    if (!tag) throw new BadRequestException(`tag with id ${tagId} not found`);
    return await this.tagRepo.remove(tag);
  }
}
