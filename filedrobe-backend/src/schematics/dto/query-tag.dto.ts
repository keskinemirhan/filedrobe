import { IsBoolean, IsOptional } from "class-validator";

export class QueryTagDto {
  @IsOptional()
  @IsBoolean()
  drive?: boolean;
}
