import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Roles } from '../roles/roles.entity'; 
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dtos/register.dto'; 
import { User } from '../users/schemas/user.entity'; 
import { LoginInput } from './dtos/login.dto';

@Injectable()
export class AuthService {
  userRepository: any;
  doctorService: any;
  patientService: any;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async register(registerDto: RegisterInput): Promise<User> {
    const { username, email, password, role, sex, age } = registerDto;
    
    // Find the role entity by name (e.g., 'doctor' or 'patient')
    const roleEntity = await this.rolesRepository.findOne({ where: { roles_name: role } });
    
    if (!roleEntity) {
      throw new Error('Role not found');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      sex,
      age,
      roleEntity,
    });
  
    const savedUser = await this.userRepository.save(newUser);
  
    
    if (role === 'doctor') {
      await this.doctorService.createDoctorForUser(savedUser.id);
    } else if (role === 'patient') {
      await this.patientService.createPatientForUser(savedUser.id);
    }
  
    return savedUser;
  }
  

  async login(loginDto: LoginInput) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, userId: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}

