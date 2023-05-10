import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDrive } from "./entities/user-drive.entity";
import { DriveFolder } from "./entities/drive-folder.entity";
import { DriveFile } from "./entities/drive-file.entity";
import { ProfileModule } from "src/profile/profile.module";
import { DriveService } from "./drive.service";
import { DriveController } from "./drive.controller";
import { UsersModule } from "src/user/user.module";
import { FileService } from "./file.service";
import { FolderService } from "./folder.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDrive, DriveFolder, DriveFile]),
    ProfileModule,
    UsersModule,
  ],
  providers: [DriveService, FileService, FolderService],
  controllers: [DriveController],
  exports: [DriveService, FileService, FolderService],
})
export class DriveModule {}
