import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.dto';
import { RegisterInput } from './dtos/register.dto';
import { AuthResponse } from './dtos/authresponse.dto';
import { UserGraphQL } from '../users/schemas/user.model';
import { HttpCode } from '@nestjs/common';
import { Public } from './auth.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  @HttpCode(200)
  async login(
    @Args('login') loginDto: LoginInput,
    @Context() context: any,
  ): Promise<AuthResponse> {
    const { req } = context;
    console.log(req.originalUrl); // Ensure req is available
    const { access_token } = await this.authService.login(loginDto);
    return { access_token };
  }

  @Public()
  @Mutation(() => UserGraphQL)
  async register(@Args('register') registerDto: RegisterInput) {
    return this.authService.register(registerDto);
  }

  @Mutation(() => String)
  protectedRoute(): string {
    return 'This route is protected by JWT authentication';
  }
}
