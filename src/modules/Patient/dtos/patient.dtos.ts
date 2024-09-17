import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  readonly blood_group: string;

  @IsNumber()
  @IsNotEmpty()
  readonly weight: number;
}
