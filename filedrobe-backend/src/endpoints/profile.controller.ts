import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProfileService } from "src/api/modules/profile/profile.service";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateProfileDto } from "src/api/modules/profile/dto/update-profile.dto";
@UseGuards(AuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Post()
  async updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any
  ) {
    return await this.profileService.updateProfile(
      req.user.profile.id,
      updateProfileDto
    );
  }
  @Get()
  async getMyProfile(@Req() req: any) {
    return await this.profileService.getProfileById(req.user.profile.id);
  }
  @Get("/:username")
  async getProfileByUser(@Param("username") username: string) {
    return await this.profileService.getProfileByUsername(username);
  }
  @Delete()
  async deleteProfile(@Req() req: any) {
    return await this.profileService.deleteProfile(
      req.user.profile.id,
      req.user.id
    );
  }
}
