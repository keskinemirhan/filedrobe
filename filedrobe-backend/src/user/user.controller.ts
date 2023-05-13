import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { updateUserDto } from "./dto/update-user.dto";
@Controller("user")
export class UsersController {
  constructor(private usersService: UserService) {}
  static typeName = "user";

  //dev
  @Get("all")
  async getAllUser() {
    return await this.usersService.getAllUser();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getMe(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateMe(@Body() updateUserDto: updateUserDto, @Req() req: any) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
