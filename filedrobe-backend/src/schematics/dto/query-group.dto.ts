import { IsBoolean, IsOptional } from "class-validator";

export class QueryGroupDto {
  @IsOptional()
  @IsBoolean()
  drive?: boolean;
  @IsOptional()
  @IsBoolean()
  tags?: boolean;
  @IsOptional()
  @IsBoolean()
  schema?: boolean;
}
