import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entities/group.entity";
import { Repository } from "typeorm";
import { SchematicsService } from "./schematics.service";
import { TagService } from "./tag.service";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @Inject(forwardRef(() => SchematicsService))
    private schematicsService: SchematicsService,
    @Inject(forwardRef(() => TagService)) private tagService: TagService
  ) {}
  async getGroupByIdSchema(groupId: string, schemaId: string, drive: any) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      schemaId,
      drive
    );
    const group = await this.groupRepo.findOne({
      where: { id: groupId, schema },
    });
    return group;
  }

  async getAllGroupBySchema(schemaId: string, drive: any) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      schemaId,
      drive,
      {
        groups: true,
        tags: false,
        drive: false,
      }
    );
    return schema.groups;
  }

  async createGroup(name: string, schemaId: string, drive: any) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      schemaId,
      drive
    );
    if (!schema)
      throw new BadRequestException(`schema with id ${schemaId} not found`);
    const group = this.groupRepo.create({ name, schema });
    return await this.groupRepo.save(group);
  }

  async updateGroup(
    groupId: string,
    schemaId: string,
    drive: any,
    options: {
      name?: string;
      tags?: string[];
    }
  ) {
    if (!options.name || !options.tags) return;
    const group = await this.getGroupByIdSchema(groupId, schemaId, drive);
    if (!group)
      throw new BadRequestException(`group with id ${groupId} not found`);
    if (options.name) group.name = options.name;
    if (options.tags) {
      const tags = [];
      options.tags.forEach(async (tagId) => {
        const tag = await this.tagService.getTagByIdDrive(tagId, drive);
        tags.push(tag);
      });
      group.tags = tags;
    }
    return await this.groupRepo.save(group);
  }

  async deleteGroup(groupId: string, schemaId: string, drive: any) {
    const group = await this.getGroupByIdSchema(groupId, schemaId, drive);
    if (!group)
      throw new BadRequestException(`group with id ${groupId} not found`);
    return await this.groupRepo.remove(group);
  }
}
