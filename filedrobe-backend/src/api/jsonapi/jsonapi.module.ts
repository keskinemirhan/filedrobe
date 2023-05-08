import { Module } from "@nestjs/common";
import { AuthModule } from "../modules/auth/auth.module";
import { ProfileModule } from "../modules/profile/profile.module";
import { DriveModule } from "../modules/drive/drive.module";
import { SchematicsModule } from "../modules/schematics/schematics.module";
import { UsersModule } from "../modules/user/user.module";

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    DriveModule,
    SchematicsModule,
    UsersModule,
  ],
})
export class JsonApiModule {}
