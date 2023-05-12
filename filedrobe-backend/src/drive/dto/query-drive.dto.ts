import { IsBoolean, IsOptional } from "class-validator";

export class QueryDriveDto {
  @IsOptional()
  @IsBoolean()
  tags?: boolean;
  @IsOptional()
  @IsBoolean()
  files?: boolean;
  @IsOptional()
  @IsBoolean()
  rootFolder?: boolean;
  @IsOptional()
  @IsBoolean()
  schemas?: boolean;
}
