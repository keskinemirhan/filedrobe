import { IsBoolean, IsOptional } from "class-validator";

export class QueryFileDto {
  @IsBoolean()
  @IsOptional()
  users?: boolean;
  @IsBoolean()
  @IsOptional()
  folder?: boolean;
  @IsBoolean()
  @IsOptional()
  drive?: boolean;
}
