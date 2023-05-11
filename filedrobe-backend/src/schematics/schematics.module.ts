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
import { SchematicsController } from "./schematics.controller";
import { UsersModule } from "src/user/user.module";
import { ProfileModule } from "src/profile/profile.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Schema, Tag, Group]),
    DriveModule,
    UsersModule,
    ProfileModule,
  ],
  providers: [
    SchematicsService,
    TagService,
    GroupService,
    SchematicsInterceptor,
  ],
  controllers: [SchematicsController],
})
export class SchematicsModule {}
