import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { object } from 'joi';



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

@ObjectType()
export class DeleteUpdateChat {
  @Field()
  @IsString()
  status: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}