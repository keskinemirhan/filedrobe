import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Profile])],
  providers: [ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
