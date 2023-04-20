import { Module } from '@nestjs/common';
import { AuthModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      entities: [User],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
