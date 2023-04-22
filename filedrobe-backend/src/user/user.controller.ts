import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SCreateUserDto } from './sdto/s.create-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
@Controller('user')
export class UsersController {
  constructor(private usersService: UserService) {}
  static typeName = 'user';

  @Post()
  async createUser(@Body() data: any) {
    const user = {};
    Object.assign(user, data.data.attributes);
    return await this.usersService.createUser(user as SCreateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUser() {
    return await this.usersService.getAllUser();
  }
}
