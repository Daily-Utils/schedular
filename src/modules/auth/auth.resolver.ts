import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dtos/authresponse.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User } from '../users/schemas/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation(() => String) // Return only the access token as a string
  async login(@Args('login') loginData: LoginDto): Promise<string> {
    const { access_token } = await this.authService.login(loginData);
    return access_token; // Returning only the access token
  }

 
  @Mutation(() => User)
  async register(@Args('register') registerData: RegisterDto): Promise<User> {
    const user = await this.authService.register(registerData);
    return user; 
  }
}