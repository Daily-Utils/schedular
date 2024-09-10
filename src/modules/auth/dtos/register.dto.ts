import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Min,
  IsOptional,
  ValidateIf,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Min(3)
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
  @IsString()
  @IsNotEmpty()
  role: string;


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
  timingId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  @IsNumber()
  defaultFee?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  averageConsultingTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facilityName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facilityType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'doctor')
  facilityLocation?: string;

  // Patient-specific fields
  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  familyMember?: number[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  relation?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.role === 'patient')
  healthIssue?: string[];
}
