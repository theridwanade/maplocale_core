import {
  IsObject,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

class RawTrackDto {
  @IsEnum(["LineString"])
  type: "LineString";

  @IsArray()
  @ArrayMinSize(2) // a line needs at least 2 points
  coordinates: [number, number][];
}

export class IngestSessionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => RawTrackDto)
  rawTrack: RawTrackDto;
}
