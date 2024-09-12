import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dtos/doctor.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
  ) {}

  async createDoctorForUser(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
    });
    return this.doctorRepository.save(doctor);
  }

  async getSingleDoctorById(id: number) {
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.timings', 'timings')
      .select([
        'doctor.id',
        'user.username',
        'doctor.services',
        'doctor.speciality',
        'doctor.default_fee',
        'doctor.average_consulting_time',
        'doctor.facility_name',
        'doctor.facility_type',
        'doctor.facility_location',
        'timings',
      ])
      .where('doctor.id = :id', { id })
      .getOne();
    return doctor;
  }

  async getDoctors() {
    return this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('user', 'user', 'user.doctor_id = doctor.user_id')
      .select(['doctor.id', 'user.username'])
      .getMany();
  }

  async updateDoctorById(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  async deleteDoctorById(id: number) {
    return this.doctorRepository.delete(id);
  }

  // TODO: Implement searchDoctors method
  async searchDoctors() {}
}

