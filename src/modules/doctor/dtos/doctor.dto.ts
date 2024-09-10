import { IsNotEmpty, IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

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
  readonly timingId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly defaultFee: number;

  @IsString()
  @IsNotEmpty()
  readonly averageConsultingTime: string;

  @IsString()
  @IsNotEmpty()
  readonly facilityName: string;

  @IsString()
  @IsNotEmpty()
  readonly facilityType: string;

  @IsString()
  @IsNotEmpty()
  readonly facilityLocation: string;
}

