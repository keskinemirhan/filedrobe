import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentId?: string;
}
