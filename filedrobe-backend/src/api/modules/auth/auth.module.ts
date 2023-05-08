import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { ProfileModule } from "../profile/profile.module";
import { DriveModule } from "../drive/drive.module";

@Module({
  providers: [AuthService],
  imports: [
    DriveModule,
    ProfileModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: "devsecret",
      signOptions: { expiresIn: "6000s" },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
