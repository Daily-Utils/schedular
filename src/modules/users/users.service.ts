import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import { RegisterInput } from '../auth/dtos/register.dto';
import { LoginInput } from '../auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateDoctorDto } from '../doctor/dtos/doctor.dto';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../Patient/patient.service';

@Injectable()
export class UsersService {
  patientRepository: any;
  doctorRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {}

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'age', 'sex', 'phone'],
    });
  }

  async createUser(registerDto: RegisterInput): Promise<User> {
    const { username, email, password, sex, age, role, phone } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    let doctor_id = null;
    let patient_id = null;

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      sex,
      age,
      role,
      phone,
      doctor_id,
      patient_id,
    });

    const savedUser = await this.userRepository.save(newUser);

    if (role === 'doctor') {
      const doctorDTO = {
        services: registerDto.services,
        speciality: registerDto.speciality,
        default_fee: registerDto.default_fee,
        experience: registerDto.experience || 0,
        average_consulting_time: registerDto.average_consulting_time,
        facility_name: registerDto.facility_name,
        facility_type: registerDto.facility_type,
        user_id: savedUser.id,
        facility_location: registerDto.facility_location,
      };
      const doctor = await this.doctorService.createDoctorForUser(doctorDTO);
      await this.userRepository.update(savedUser.id, { doctor_id: doctor.id });
    } else if (role === 'patient') {
      const patientDTO = {
        health_issues: registerDto.health_issues,
        relation: registerDto.relation,
        family_member: registerDto.family_member,
        user_id: savedUser.id,
        blood_group: registerDto.blood_group || '',
        weight: registerDto.weight || 0,
      };
      const patient =
        await this.patientService.createPatientForUser(patientDTO);
      await this.userRepository.update(savedUser.id, {
        patient_id: patient.id,
      });
    }

    Logger.log(`User created with id: ${savedUser.id}`, 'UsersService');

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

  async deleteUser(id: number, manager?: EntityManager) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['doctor', 'patient'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }
}
