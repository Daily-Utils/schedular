import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import { RegisterDto } from '../auth/dtos/register.dto';
import { LoginDto } from '../auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<UserInterface[]> {
    return await this.userRepository.find({ select: ['id', 'username', 'email'] });
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { username, email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
