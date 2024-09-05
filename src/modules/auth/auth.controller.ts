import { Controller, Post, Body, UseGuards, SetMetadata, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SetMetadata('public', true) // Mark the route as public
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @SetMetadata('public', true) // Mark the route as public
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('protected-route')
  protectedRoute() {
    return 'This route is protected by JWT authentication';
  }
}
