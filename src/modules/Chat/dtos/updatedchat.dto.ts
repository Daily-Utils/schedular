import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
@InputType()
export class UpdateChatMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}
