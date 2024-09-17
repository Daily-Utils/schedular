import { Field, InputType } from '@nestjs/graphql';
import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class createAppointmentDTO {
  @Field()
  @IsNumber()
  patient_user_id: number;

  @Field()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsNumber()
  fees: number;

  @Field()
  @IsString()
  @IsEmpty()
  visit_type: string;

  @Field()
  @IsOptional()
  ivr_app_id: string;

  @Field()
  @IsString()
  @IsEmpty()
  patient_complaint: string;

  @Field()
  @IsNumber()
  patient_current_weight: number;
}

@InputType()
export class updateAppointmentDTO {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  fees: number;

  @Field()
  @IsOptional()
  visit_type: string;

  @Field()
  @IsOptional()
  ivr_app_id: string;

  @Field()
  @IsOptional()
  patient_complaint: string;

  @Field()
  @IsOptional()
  patient_current_weight: number;

  @Field()
  @IsOptional()
  status: string;
}
