import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateDoctorDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly services: string[];

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly speciality: string[];

  @IsNumber()
  @IsNotEmpty()
  readonly default_fee: number;

  @IsString()
  @IsNotEmpty()
  readonly average_consulting_time: string;

  @IsString()
  @IsNotEmpty()
  readonly facility_name: string;

  @IsString()
  @IsNotEmpty()
  readonly facility_type: string;

  @IsString()
  @IsNotEmpty()
  readonly facility_location: string;
}
