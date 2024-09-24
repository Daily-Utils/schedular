import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class outputAppointment {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  fees: number;

  @Field()
  @IsOptional()
  appointment_date_time: Date;

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
