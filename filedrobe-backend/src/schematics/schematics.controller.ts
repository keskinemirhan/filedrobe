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

@UseGuards(AuthGuard)
@UseInterceptors(SchematicsInterceptor)
@Controller()
export class SchematicsController {
  constructor(private schematicsService: SchematicsService) {}
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
}
