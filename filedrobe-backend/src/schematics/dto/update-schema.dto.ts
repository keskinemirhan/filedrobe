import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateSchemaDto {
  @IsOptional()
  @IsString()
  @MaxLength(240)
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  groups?: string[];
}
