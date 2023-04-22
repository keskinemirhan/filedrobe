import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginByUsernameDto } from '../dto/login-by-username.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginByEmailDto } from '../dto/login-by-email.dto';
import { RegisterDto } from '../dto/register.dto';
import { SCreateUserDto } from 'src/user/sdto/s.create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async loginByUsername(loginByUsernameDto: LoginByUsernameDto) {
    const user = await this.userService.findByUsername(
      loginByUsernameDto.username,
    );
    if (!user || !(user.password === loginByUsernameDto.password))
      throw new BadRequestException('invalid credentials');
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginByEmail(loginByEmail: LoginByEmailDto) {
    const user = await this.userService.findByEmail(loginByEmail.email);
    if (!user || !(user.password === loginByEmail.password))
      throw new BadRequestException('invalid credentials');
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const byUsername = await this.userService.findByUsername(
      registerDto.username,
    );
    if (byUsername) throw new BadRequestException('username already exists');
    const byEmail = await this.userService.findByEmail(registerDto.email);
    if (byEmail) throw new BadRequestException('email already exists');
    return this.userService.createUser(registerDto as SCreateUserDto);
  }
}
