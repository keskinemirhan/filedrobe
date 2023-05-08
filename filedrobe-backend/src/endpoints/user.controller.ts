import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { UserService } from "src/api/modules/user/user.service";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "src/api/modules/user/dto/update-user.dto";
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
    const { profile, password, id, ...user } = req.user;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
