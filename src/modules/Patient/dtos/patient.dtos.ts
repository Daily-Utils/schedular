import { IsNotEmpty, IsArray, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  readonly family_member: number[];

  @IsArray()
  @IsString({ each: true })
  readonly relation: string[];

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly health_issues: string[];
}

