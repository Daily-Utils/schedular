import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class searchAppointmentDTO {
  @Field()
  @IsNumber()
  doctor_user_id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  patient_user_id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  visit_type?: string;
}

@ObjectType()
export class AppointmentResponse {
  @Field()
  id: number;

  @Field()
  doctor_user_id: number;

  @Field()
  patient_id: number;

  @Field()
  fees: number;

  @Field()
  status: string;

  @Field()
  visit_type: string;

  @Field()
  created_at: Date;
}
