import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.dto';
import { RegisterInput } from './dtos/register.dto';
import { AuthResponse } from './dtos/authresponse.dto';
import { Body, HttpCode } from '@nestjs/common';
import { UserGraphQL } from '../users/schemas/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserGraphQL)
  async register(@Body('register') registerDto: RegisterInput) {
    return this.authService.register(registerDto);
  }

  @Mutation(() => AuthResponse)
  @HttpCode(200)
  async login(@Args('login') loginDto: LoginInput): Promise<AuthResponse> {
    const { access_token } = await this.authService.login(loginDto);
    return { access_token };
  }

  @Mutation(() => String)
  protectedRoute(): string {
    return 'This route is protected by JWT authentication';
  }
}
