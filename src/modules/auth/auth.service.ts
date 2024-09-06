import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dtos/register.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from '../users/schemas/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async register(registerDto: RegisterInput): Promise<User> {
    const newUser = await this.userService.createUser(registerDto);
    return newUser; // Return only the user object
  }

  async login(loginDto: LoginInput) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
