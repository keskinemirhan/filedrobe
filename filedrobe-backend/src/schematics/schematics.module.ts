import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schema } from "./entities/schema.entity";
import { Tag } from "./entities/tag.entity";
import { Group } from "./entities/group.entity";
import { SchematicsService } from "./schematics.service";
import { DriveModule } from "src/drive/drive.module";

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Tag, Group]), DriveModule],
  providers: [SchematicsService],
})
export class SchematicsModule {}
