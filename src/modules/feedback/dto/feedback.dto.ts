import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsDate, IsInt, isNumber } from 'class-validator';

@InputType()
export class CreateFeedbackInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;


  @Field()
  @IsNotEmpty()
  consulting_feedback: number;

  @Field()
  @IsNotEmpty()
  clinic_feedback: number;

  @Field()
  @IsNotEmpty()
  waiting_time: number;
}
