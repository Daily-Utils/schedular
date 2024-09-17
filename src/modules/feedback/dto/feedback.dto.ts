import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsInt,
  isNumber,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateFeedbackInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  patient_user_id: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsNotEmpty()
  consulting_feedback: number;

  @Field()
  @IsNotEmpty()
  clinic_or_hospital_feedback: number;

  @Field()
  @IsNotEmpty()
  waiting_time: number;
}

@InputType()
export class UpdateFeedbackInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  consulting_feedback: number;

  @Field()
  @IsNotEmpty()
  @IsOptional()
  clinic_or_hospital_feedback: number;

  @Field()
  @IsOptional()
  waiting_time: number;
}
