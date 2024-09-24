import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FeedbackCreateOutput {
  @Field()
  id: number;

  @Field()
  patient_user_id: number;

  @Field()
  consulting_feedback: number;

  @Field()
  clinic_or_hospital_feedback: number;

  @Field()
  waiting_time: number;
}