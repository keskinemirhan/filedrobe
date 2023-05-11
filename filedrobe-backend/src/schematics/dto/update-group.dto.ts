import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateGroupDto {
  @IsString()
  @MaxLength(120)
  @MinLength(4)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  tags?: string[];
}
