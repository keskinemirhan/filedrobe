import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateFileDto {
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  name?: string;
}
