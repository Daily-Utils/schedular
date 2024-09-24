import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dtos/register.dto';
import { User } from '../users/schemas/user.entity';
import { LoginInput } from './dtos/login.dto';

@Injectable()
export class AuthService {
  userRepository: any;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async register(registerDto: RegisterInput): Promise<User> {
    const savedUser = await this.userService.createUser(registerDto);
    return savedUser;
  }

  async login(loginDto: LoginInput) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      username: user.username,
      userId: user.id,
      user_assignment: user.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
