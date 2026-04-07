import { IsArray, ValidateNested, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

// IngestSessionDto
export class RawPointDto {
  @IsNumber() timestamp: number;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsNumber() accuracy: number;
  @IsNumber() @IsOptional() altitude: number | null;
  @IsNumber() @IsOptional() altitudeAccuracy: number | null;
  @IsNumber() @IsOptional() heading: number | null;
  @IsNumber() @IsOptional() speed: number | null;
}

export class IngestSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RawPointDto)
  points: RawPointDto[];
}
