import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsOptional,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Role } from '../../roles/roles.enum';
import { BloodGroup } from '../../Patient/patient.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sex: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @Field()
  @IsEnum(Role)
  role: Role;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  // Doctor-specific fields
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  services?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  speciality?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  @IsNumber()
  default_fee?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  average_consulting_time?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  experience?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facility_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facility_type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facility_location?: string;

  // Patient-specific fields
  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  family_member?: number[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  relation?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  health_issues?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(BloodGroup)
  @ValidateIf((o) => o.role === 'patient')
  blood_group?: BloodGroup;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  weight?: number;
}
