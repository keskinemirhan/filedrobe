import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginByUsernameDto {
  @IsString()
  @MaxLength(256)
  @MinLength(4)
  username: string;

  @IsString()
  @MaxLength(256)
  @MinLength(8)
  password: string;
}
