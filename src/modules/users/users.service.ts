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
      select: ['id', 'username', 'email'],
    });
  }

  async createUser(registerDto: RegisterInput): Promise<User> {
    const { username, email, password, sex, age, role } = registerDto;
  
   
    const hashedPassword = await bcrypt.hash(password, 10);
  
 
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      sex,
      age,
      role,
      created_at: new Date(),
      updated_at: new Date(),
    });
  
    
    const savedUser = await this.userRepository.save(newUser);
  
   
    if (role === 'doctor') {
      const doctor = this.doctorRepository.create({
        user: savedUser, 
        services: registerDto.services, 
        speciality: registerDto.speciality,
        timingId: registerDto.timingId,
        defaultFee: registerDto.defaultFee,
        averageConsultingTime: registerDto.averageConsultingTime,
        facilityName: registerDto.facilityName,
        facilityType: registerDto.facilityType,
        facilityLocation: registerDto.facilityLocation,
      });
      await this.doctorRepository.save(doctor);
    } else if (role === 'patient') {
      const patient = this.patientRepository.create({
        user: savedUser, 
        familyMember: registerDto.familyMember, 
        relation: registerDto.relation,
        healthIssue: registerDto.healthIssue,
      });
      await this.patientRepository.save(patient);
    }
  
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
