import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { User } from '../users/schemas/user.entity';
import { UsersService } from '../users/users.service';
import { CreateDoctorDto } from './dtos/doctor.dto';

@Injectable()
export class DoctorService {
  constructor(@InjectRepository(Doctor) private doctorRepository: Repository<Doctor>) {}

  async createDoctorForUser(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
    });
    return this.doctorRepository.save(doctor);
  }
}

