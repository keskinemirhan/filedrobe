import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { SchematicsInterceptor } from "./interceptor/schematics.interceptor";
import { SchematicsService } from "./schematics.service";
import { CreateSchemaDto } from "./dto/create-schema.dto";
import { UpdateSchemaDto } from "./dto/update-schema.dto";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { QuerySchemaDto } from "./dto/query-schema.dto";
import { QueryGroupDto } from "./dto/query-group.dto";
import { QueryTagDto } from "./dto/query-tag.dto";

@UseGuards(AuthGuard)
@UseInterceptors(SchematicsInterceptor)
@Controller()
export class SchematicsController {
  constructor(
    private groupService: GroupService,
    private schematicsService: SchematicsService,
    private tagService: TagService
  ) {}
  //Schema==========================================
  @Get("schema")
  async getAllSchema(@Body() querySchemaDto: QuerySchemaDto, @Req() req: any) {
    const schemas = await this.schematicsService.getAllSchemaDrive(
      req.drive,
      querySchemaDto
    );
    return schemas;
  }

  @Get("schema/:id")
  async getSchema(
    @Body() querySchemaDto: QuerySchemaDto,
    @Param("id") id: string,
    @Req() req: any
  ) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      id,
      req.drive,
      querySchemaDto
    );
    return schema;
  }

  @Post("schema")
  async createSchema(
    @Body() createSchemaDto: CreateSchemaDto,
    @Req() req: any
  ) {
    const schema = await this.schematicsService.createSchemaDrive(
      createSchemaDto.name,
      req.drive
    );
    return schema;
  }

  @Patch("schema/:id")
  async updateSchema(
    @Param("id") id: string,
    @Body() updateSchemaDto: UpdateSchemaDto,
    @Req() req: any
  ) {
    const schema = await this.schematicsService.updateSchemaDrive(
      id,
      req.drive,
      updateSchemaDto
    );
    return schema;
  }

  @Delete("schema/:id")
  async deleteSchema(@Param("id") id: string, @Req() req: any) {
    const schema = await this.schematicsService.deleteSchemaDrive(
      id,
      req.drive
    );
    return schema;
  }

  //TAG=========================================
  @Get("tag/:id")
  async getTag(
    @Body() queryTagDto: QueryTagDto,
    @Param("id") id: string,
    @Req() req: any
  ) {
    const tag = await this.tagService.getTagByIdDrive(
      id,
      req.drive,
      queryTagDto
    );
    return tag;
  }

  @Get("tag")
  async getAllTagByDrive(@Body() queryTagDto: QueryTagDto, @Req() req: any) {
    const tags = await this.tagService.getAllTagByDrive(req.drive, queryTagDto);
    return tags;
  }

  @Get("tag/schema/:id")
  async getAllTagBySchema(
    @Body() queryTagDto: QueryTagDto,
    @Req() req: any,
    @Param("id") id: string
  ) {
    const tags = await this.tagService.getAllTagBySchema(
      id,
      req.drive,
      queryTagDto
    );
    return tags;
  }

  @Post("tag")
  async createTag(@Body() createTagDto: CreateTagDto, @Req() req: any) {
    const name = createTagDto.name;
    const color = createTagDto.color;
    const description = createTagDto.description;
    const tag = await this.tagService.createTag(
      name,
      color,
      description,
      req.drive
    );
    return tag;
  }

  @Patch("tag/:id")
  async updateTag(
    @Body() updateTagDto: UpdateTagDto,
    @Param("id") id: string,
    @Req() req: any
  ) {
    const updated = await this.tagService.updateTagDrive(
      id,
      req.drive,
      updateTagDto
    );
    return updated;
  }

  @Delete("tag/:id")
  async deleteTag(@Param("id") id: string, @Req() req: any) {
    await this.tagService.deleteTagDrive(id, req.drive);
    return;
  }

  //GROUP==================================

  @Get("group/schema/:id")
  async getAllGroup(
    @Body() queryGroupDto: QueryGroupDto,
    @Param("id") id: string,
    @Req() req: any
  ) {
    const groups = await this.groupService.getAllGroupBySchema(
      id,
      req.drive,
      queryGroupDto
    );
    return groups;
  }

  @Get("group/:groupId")
  async getGroup(
    @Body() queryGroupDto: QueryGroupDto,
    @Param("groupId") groupId: string,
    @Req() req: any
  ) {
    const group = await this.groupService.getGroupByIdDrive(
      groupId,
      req.drive,
      queryGroupDto
    );
    return group;
  }

  @Post("group")
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    const created = await this.groupService.createGroup(
      createGroupDto.name,
      createGroupDto.schemaId,
      req.drive
    );
    return created;
  }

  @Patch("group/:id")
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param("id") id: string,
    @Req() req: any
  ) {
    const updated = await this.groupService.updateGroup(
      id,
      req.drive,
      updateGroupDto
    );

    return updated;
  }

  @Delete("group/:id")
  async deleteGroup(@Param("id") id: string, @Req() req: any) {
    await this.groupService.deleteGroup(id, req.drive);
    return;
  }
}
