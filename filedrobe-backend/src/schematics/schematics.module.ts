import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schema } from "./entities/schema.entity";
import { Tag } from "./entities/tag.entity";
import { Group } from "./entities/group.entity";
import { SchematicsService } from "./schematics.service";
import { DriveModule } from "src/drive/drive.module";
import { TagService } from "./tag.service";
import { GroupService } from "./group.service";
import { SchematicsInterceptor } from "./interceptor/schematics.interceptor";

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Tag, Group]), DriveModule],
  providers: [
    SchematicsService,
    TagService,
    GroupService,
    SchematicsInterceptor,
  ],
})
export class SchematicsModule {}
