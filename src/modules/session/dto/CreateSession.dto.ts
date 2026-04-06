import { IsEnum, IsString, IsOptional } from "class-validator";
import { MappingMode } from "src/prisma/generated/enums";

export class CreateSessionDto {
  @IsString()
  name: string;

  @IsEnum(MappingMode)
  @IsOptional()
  mappingMode?: MappingMode;
}
