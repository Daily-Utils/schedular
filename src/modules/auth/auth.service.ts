import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dtos/register.dto'; 
import { User } from '../users/schemas/user.entity'; 
import { LoginInput } from './dtos/login.dto';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../Patient/patient.service';

@Injectable()
export class AuthService {
  userRepository: any;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async register(registerDto: RegisterInput): Promise<User> {
    const { role } = registerDto;
    const savedUser = await this.userService.createUser(registerDto);
    if (role === 'doctor') {
      const doctorDTO = {
        id: savedUser.id,
        services: registerDto.services,
        speciality: registerDto.speciality,
        default_fee: registerDto.default_fee,
        average_consulting_time: registerDto.average_consulting_time,
        facility_name: registerDto.facility_name,
        facility_type: registerDto.facility_type,
        facility_location: registerDto.facility_location,
      };
      await this.doctorService.createDoctorForUser(doctorDTO);
    } else if (role === 'patient') {
      const patientDTO = {
        id: savedUser.id,
        health_issues: registerDto.health_issues,
        relation: registerDto.relation,
        family_member: registerDto.family_member,
      };
      await this.patientService.createPatientForUser(patientDTO);
    }
    return savedUser;
  }
  

  async login(loginDto: LoginInput) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, userId: user.id, user_assignment: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}

