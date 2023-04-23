import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDrive } from './entities/user-drive.entity';
import { DriveFolder } from './entities/drive-folder.entity';
import { DriveFile } from './entities/drive-file.entity';
import { FilePermission } from './entities/file-permission.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDrive,
      DriveFolder,
      DriveFile,
      FilePermission,
    ]),
    ProfileModule,
  ],
})
export class DriveModule {}
