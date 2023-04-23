import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { DriveModule } from './drive/drive.module';
import { SchematicsModule } from './schematics/schematics.module';
import { UserDrive } from './drive/entities/user-drive.entity';
import { DriveFolder } from './drive/entities/drive-folder.entity';
import { DriveFile } from './drive/entities/drive-file.entity';
import { FilePermission } from './drive/entities/file-permission.entity';
import { Schema } from './schematics/entities/schema.entity';
import { Tag } from './schematics/entities/tag.entity';
import { Group } from './schematics/entities/group.entity';

@Module({
  imports: [
    SchematicsModule,
    DriveModule,
    ProfileModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
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
    ProfileModule,
    DriveModule,
    SchematicsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
