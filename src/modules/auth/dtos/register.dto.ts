import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword, Min } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @Min(3)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
