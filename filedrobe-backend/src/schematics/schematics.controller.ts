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

@UseGuards(AuthGuard)
@UseInterceptors(SchematicsInterceptor)
@Controller()
export class SchematicsController {
  constructor(
    private schematicsService: SchematicsService,
    private tagService: TagService
  ) {}
  //Schema==========================================
  @Get("schema")
  async getAllSchema(@Req() req: any) {
    const schemas = await this.schematicsService.getAllSchemaDrive(req.drive);
    return schemas;
  }

  @Get("schema/:id")
  async getSchema(@Param("id") id: string, @Req() req: any) {
    const schema = await this.schematicsService.getSchemaByIdDrive(
      id,
      req.drive
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
  async getTag(@Param("id") id: string, @Req() req: any) {
    const tag = await this.tagService.getTagByIdDrive(id, req.drive);
    return tag;
  }

  @Get("tag")
  async getAllTagByDrive(@Req() req: any) {
    const tags = await this.tagService.getAllTagByDrive(req.drive);
    return tags;
  }

  @Get("tag/schema/:id")
  async getAllTagBySchema(@Req() req: any, @Param("id") id: string) {
    const tags = await this.tagService.getAllTagBySchema(id, req.drive);
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
}
