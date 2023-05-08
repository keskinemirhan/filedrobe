import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./api/modules/user/entities/user.entity";
import { Profile } from "./api/modules/profile/entities/profile.entity";
import { DriveFolder } from "./api/modules/drive/entities/drive-folder.entity";
import { UserDrive } from "./api/modules/drive/entities/user-drive.entity";
import { DriveFile } from "./api/modules/drive/entities/drive-file.entity";
import { FilePermission } from "./api/modules/drive/entities/file-permission.entity";
import { Schema } from "./api/modules/schematics/entities/schema.entity";
import { Tag } from "./api/modules/schematics/entities/tag.entity";
import { Group } from "./api/modules/schematics/entities/group.entity";
import { JsonApiModule } from "./api/jsonapi/jsonapi.module";
import { EndpointModule } from "./endpoints/endpoint.module";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      synchronize: true,
      entities: [
        User,
        Profile,
        UserDrive,
        DriveFolder,
        DriveFile,
        FilePermission,
        Schema,
        Tag,
        Group,
      ],
    }),
    JsonApiModule,
    EndpointModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
