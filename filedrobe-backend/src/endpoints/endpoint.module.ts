import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { DriveController } from "./drive.controller";
import { ProfileController } from "./profile.controller";
import { UsersController } from "./user.controller";
import { AuthModule } from "src/api/modules/auth/auth.module";
import { DriveModule } from "src/api/modules/drive/drive.module";
import { ProfileModule } from "src/api/modules/profile/profile.module";
import { UsersModule } from "src/api/modules/user/user.module";
import { AuthGuard } from "./guards/auth.guard";

@Module({
  controllers: [
    AuthController,
    DriveController,
    ProfileController,
    UsersController,
  ],
  imports: [AuthModule, DriveModule, ProfileModule, UsersModule],
  providers: [AuthGuard],
})
export class EndpointModule {}
