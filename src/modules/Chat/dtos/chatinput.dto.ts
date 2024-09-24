import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChatType } from '../chat.enum';

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
  @IsEnum(ChatType)
  type: ChatType;

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
}


