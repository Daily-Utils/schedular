import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class ChatMessageOutput {
  @Field()
  chat_id: number;

  @Field()
  patient_user_id: number;

  @Field()
  doctor_user_id: number;

  @Field()
  type: string;

  @Field()
  message: string;
}
