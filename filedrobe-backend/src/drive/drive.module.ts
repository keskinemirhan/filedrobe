import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDrive } from "./entities/user-drive.entity";
import { DriveFolder } from "./entities/drive-folder.entity";
import { DriveFile } from "./entities/drive-file.entity";
import { ProfileModule } from "src/profile/profile.module";
import { DriveService } from "./drive.service";
import { DriveController } from "./drive.controller";
import { UsersModule } from "src/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDrive, DriveFolder, DriveFile]),
    ProfileModule,
    UsersModule,
  ],
  providers: [DriveService],
  controllers: [DriveController],
  exports: [DriveService],
})
export class DriveModule {}
