import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class updateUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  @MinLength(6)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @MinLength(4)
  username?: string;
}
