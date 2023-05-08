import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  name: string;

  @IsString()
  @IsUUID()
  parentId: string;
}
