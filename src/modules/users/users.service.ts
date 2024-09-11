import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import { RegisterInput } from '../auth/dtos/register.dto';
import { LoginInput } from '../auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateDoctorDto } from '../doctor/dtos/doctor.dto';

@Injectable()
export class UsersService {
  patientRepository: any;
  doctorRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'age', 'sex'], 
    });
  }

  async createUser(registerDto: RegisterInput): Promise<User> {
    const { username, email, password, sex, age, role, phone } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      sex,
      age,
      role,
      phone
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
  

  async validateUser(loginDto: LoginInput): Promise<User | null> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
