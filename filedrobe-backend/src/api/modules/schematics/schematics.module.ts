import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schema } from './entities/schema.entity';
import { Tag } from './entities/tag.entity';
import { Group } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Tag, Group])],
})
export class SchematicsModule {}
