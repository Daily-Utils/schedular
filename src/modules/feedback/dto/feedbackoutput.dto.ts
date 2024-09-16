import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FeedbackOutput {
  @Field()
  id: number;

  @Field()
  patient_id: number;


  @Field()
  consulting_feedback: number;

  @Field()
  clinic_feedback: number;

  @Field()
  waiting_time: number;

 
}
