import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateSchemaDto {
  @IsString()
  @MaxLength(240)
  @MinLength(1)
  name: string;
}
