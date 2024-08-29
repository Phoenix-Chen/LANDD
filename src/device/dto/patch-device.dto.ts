import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIP,
  IsMACAddress,
  IsOptional,
  IsString,
} from "class-validator";

const optionalBooleanMapper = new Map([
  ['true', true],
  ['false', false],
]);


export class PatchDeviceDto {
  @IsString()
  name: string;
}

export class OptionalOnlineDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  online?: boolean;
}

export class GetDevicesQueryDto extends OptionalOnlineDto {
  @IsArray()
  @IsString({each: true})
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  macAddress_in?: string[];
}

export class UpdateOrCreateDto extends OptionalOnlineDto {
  @IsString()
  @IsMACAddress()
  macAddress: string;

  @IsString()
  @IsIP()
  ip: string;

  @IsString()
  @IsOptional()
  name?: string;
}
