import { IsEmail, IsString, IsStrongPassword, Min } from "class-validator";

export class RegisterDto {

  @IsString()
  @Min(3)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 8 })
  password: string;
}