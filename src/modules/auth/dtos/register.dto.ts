import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Min,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Min(3)
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sex: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  role: string;
}
