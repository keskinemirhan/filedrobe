import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { JsonApiModule } from 'src/shared/json-api/json-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JsonApiModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
