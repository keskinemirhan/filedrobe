import { Injectable } from "@nestjs/common";
import { UserService } from "../modules/user/user.service";
import { DriveService } from "../modules/drive/drive.service";
import { ProfileService } from "../modules/profile/profile.service";
import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class JsonApiService {
  constructor(
    private userService: UserService,
    private driveService: DriveService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  mapping = {
    user: this.userService,
    drive: this.driveService,
    profile: this.profileService,
  };

  handle(resourceType: string) {}
}
