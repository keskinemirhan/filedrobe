import { IsString, IsUUID, MaxLength } from "class-validator";

export class CreateFileDto {
  @IsString()
  @MaxLength(240)
  name: string;

  @IsUUID()
  folderId: string;
}
