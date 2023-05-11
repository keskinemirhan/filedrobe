import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @MinLength(2)
  name?: string;

  @IsString()
  @MaxLength(350)
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
