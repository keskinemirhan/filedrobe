import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SCreateUserDto } from './sdto/s.create-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { updateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UsersController {
  constructor(private usersService: UserService) {}
  static typeName = 'user';

  //dev
  @Get('all')
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
  async updateMe(@Body() updateUserDto: updateUserDto, @Req() req: any) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}