import { IsNotEmpty, IsArray, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsArray()
  @IsNumber({}, { each: true })  
  readonly familyMember: number[];

  @IsArray()
  @IsString({ each: true }) 
  readonly relation: string[];

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })  
  readonly healthIssue: string[];
}

