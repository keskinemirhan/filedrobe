import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDrive } from './entities/user-drive.entity';
import { DriveFolder } from './entities/drive-folder.entity';
import { DriveFile } from './entities/drive-file.entity';
import { FilePermission } from './entities/file-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDrive,
      DriveFolder,
      DriveFile,
      FilePermission,
    ]),
  ],
})
export class DriveModule {}
