import { IsBoolean, IsOptional } from "class-validator";

export class QueryFolderDto {
  @IsOptional()
  @IsBoolean()
  files?: boolean;
  @IsOptional()
  @IsBoolean()
  children?: boolean;
  @IsOptional()
  @IsBoolean()
  parent?: boolean;
  @IsOptional()
  @IsBoolean()
  rootFolder?: boolean;
  @IsOptional()
  @IsBoolean()
  users?: boolean;
}
