import { IsBoolean, IsOptional } from "class-validator";

export class QuerySchemaDto {
  @IsOptional()
  @IsBoolean()
  groups?: boolean;

  @IsOptional()
  @IsBoolean()
  tags?: boolean;

  @IsOptional()
  @IsBoolean()
  drive?: boolean;
}
