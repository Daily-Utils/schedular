import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
@InputType()
export class CreateChatMessageInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  patient_user_id: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string; 

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
}


