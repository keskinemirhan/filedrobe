import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginByUsernameDto } from '../dto/login-by-username.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginByEmailDto } from '../dto/login-by-email.dto';
import { RegisterDto } from '../dto/register.dto';
import { SCreateUserDto } from 'src/user/sdto/s.create-user.dto';
import { ProfileService } from 'src/profile/profile.service';
import { DriveService } from 'src/drive/drive.service';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private jwtService: JwtService,
    private driveService: DriveService,
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
    const regDrive = await this.driveService.createDrive();
    const regProfile = await this.profileService.createProfile(regDrive);
    const { profile, ...registered } = await this.userService.createUser({
      profile: regProfile,
      ...registerDto,
    });
    return registered;
  }
}
