import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @MaxLength(120)
  @MinLength(4)
  name: string;

  @IsUUID()
  schemaId: string;
}
