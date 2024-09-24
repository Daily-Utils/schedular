import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppointmentStatus } from '../appointment.enum';

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
  status: 'scheduled' | 'rescheduled' | 'on-hold' | 'on-going' | 'completed' | 'reschedule_needed';

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
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
