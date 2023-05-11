import { IsHexColor, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
  @IsString()
  @MaxLength(120)
  @MinLength(2)
  name: string;

  @IsHexColor()
  color: string;

  @IsString()
  @MaxLength(350)
  description: string;
}
