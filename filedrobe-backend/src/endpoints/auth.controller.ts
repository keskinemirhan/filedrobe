import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/api/modules/auth/auth.service";
import { LoginByEmailDto } from "src/api/modules/auth/dto/login-by-email.dto";
import { LoginByUsernameDto } from "src/api/modules/auth/dto/login-by-username.dto";
import { RegisterDto } from "src/api/modules/auth/dto/register.dto";
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/username")
  async loginByUsername(@Body() loginByUsernameDto: LoginByUsernameDto) {
    return await this.authService.loginByUsername(loginByUsernameDto);
  }
  @Post("login/email")
  async loginByEmail(@Body() loginByEmailDto: LoginByEmailDto) {
    return await this.authService.loginByEmail(loginByEmailDto);
  }
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const { password, ...registered } = await this.authService.register(
      registerDto
    );
    return registered;
  }
}
