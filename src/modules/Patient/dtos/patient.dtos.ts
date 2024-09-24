import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { BloodGroup } from '../patient.enum';

export class CreatePatientDto {
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

  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;

  @IsEnum(BloodGroup)
  readonly blood_group: BloodGroup;

  @IsNumber()
  @IsNotEmpty()
  readonly weight: number;
}
