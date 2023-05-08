import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { ProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Profile])],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
