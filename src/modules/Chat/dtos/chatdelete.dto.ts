import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty,  IsString } from 'class-validator';

@ObjectType()
export class DeleteChat {

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}