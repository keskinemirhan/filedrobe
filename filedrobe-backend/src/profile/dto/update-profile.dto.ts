import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  surname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  phoneNumber?: string;

  @MaxLength(256, { each: true })
  @MinLength(4, { each: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  contacts?: string[];
}
