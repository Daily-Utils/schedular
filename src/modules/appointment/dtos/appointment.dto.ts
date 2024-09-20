import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class createAppointmentDTO {
  @Field()
  @IsNumber()
  patient_user_id: number;

  @Field()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsDate()
  appointment_date_time: Date;

  @Field()
  @IsString()
  status: string

  @Field()
  @IsNumber()
  fees: number;

  @Field()
  @IsString()
  visit_type: string;

  @Field()
  @IsOptional()
  ivr_app_id: string;

  @Field()
  @IsString()
  patient_complaint: string;

  @Field()
  @IsNumber()
  patient_current_weight: number;
}

@InputType()
export class updateAppointmentDTO {
  @Field()
  @IsOptional()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  fees?: number;

  @Field({ nullable: true })
  @IsOptional()
  appointment_date_time?: Date;

  @Field({ nullable: true })
  @IsOptional()
  visit_type?: string;

  @Field({ nullable: true })
  @IsOptional()
  ivr_app_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  patient_complaint?: string;

  @Field({ nullable: true })
  @IsOptional()
  patient_current_weight?: number;

  @Field({ nullable: true })
  @IsOptional()
  status?: string;
}
