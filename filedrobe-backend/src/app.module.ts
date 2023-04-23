import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { DriveModule } from './drive/drive.module';

@Module({
  imports: [
    ProfileModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      entities: [User, Profile],
    }),
    ProfileModule,
    DriveModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
