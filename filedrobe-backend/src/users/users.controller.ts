import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { JsonApiInterceptor } from 'src/shared/json-api/interceptors/json-api.interceptor';
import { CreateUserResourceObj } from 'src/shared/json-api/service/resource-types/user.obj';
import { UsersService } from './users.service';
import { SCreateUserDto } from './sdto/s.create-user.dto';
@UseInterceptors(JsonApiInterceptor)
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
  static typeName = 'user';

  @Post()
  async createUser(@Body() data: any) {
    const user = {};
    Object.assign(user, data.data.attributes);
    return await this.usersService.createUser(user as SCreateUserDto);
  }

  @Get()
  async getAllUser() {
    return await this.usersService.getAllUser();
  }
}
