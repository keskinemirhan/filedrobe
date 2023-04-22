import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LoginByUsernameDto } from './dto/login-by-username.dto';
import { LoginByEmailDto } from './dto/login-by-email.dto';
import { RegisterDto } from './dto/register.dto';
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login/username')
  async loginByUsername(@Body() loginByUsernameDto: LoginByUsernameDto) {
    return await this.authService.loginByUsername(loginByUsernameDto);
  }
  @Post('login/email')
  async loginByEmail(@Body() loginByEmailDto: LoginByEmailDto) {
    return await this.authService.loginByEmail(loginByEmailDto);
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { password, ...registered } = await this.authService.register(
      registerDto,
    );
    return registered;
  }
}
