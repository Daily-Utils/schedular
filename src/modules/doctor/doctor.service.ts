import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dtos/doctor.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';
import {
  DoctorResponseDto,
  responseForAllDoctorsFindArray,
} from './dtos/output.dto';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { searchDTO } from './dtos/search.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private dataSource: DataSource,
  ) {}

  async createDoctorForUser(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
    });
    return this.doctorRepository.save(doctor);
  }

  async getSingleDoctorById(id: number): Promise<DoctorResponseDto> {
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.timings', 'timings')
      .select([
        'doctor.id',
        'user.username',
        'doctor.services',
        'doctor.speciality',
        'doctor.experience',
        'doctor.default_fee',
        'doctor.average_consulting_time',
        'doctor.facility_name',
        'doctor.facility_type',
        'doctor.facility_location',
        'timings',
      ])
      .where('doctor.user_id = :id', { id })
      .getOne();

    const mappedDoctor: DoctorResponseDto = {
      id: doctor.user_id,
      username: doctor.user.username,
      services: doctor.services,
      speciality: doctor.speciality,
      default_fee: doctor.default_fee,
      experience: doctor.experience,
      average_consulting_time: doctor.average_consulting_time,
      facility_name: doctor.facility_name,
      facility_type: doctor.facility_type,
      facility_location: doctor.facility_location,
      timings: doctor.timings || [],
    };

    return mappedDoctor;
  }

  async getDoctors(): Promise<responseForAllDoctorsFindArray> {
    const doctors = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select(['doctor.user_id', 'user.username', 'user.id'])
      .getMany();

    const mappedDoctors = doctors.map((doctor) => ({
      id: doctor.user_id,
      username: doctor.user.username,
    }));

    return {
      doctors: mappedDoctors || [],
    };
  }

  async updateDoctorById(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update({ user_id: id }, updateDoctorDto);
  }

  async deleteDoctorById(id: number) {
    await this.dataSource.transaction(async (manager) => {
      await this.userService.deleteUser(id, manager);
    });
  }

  async searchDoctors(searchData: searchDTO) {
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor.user_id',
        'user.username',
        'doctor.services',
        'doctor.speciality',
        'doctor.experience',
        'doctor.facility_name',
        'doctor.facility_location',
        'doctor.facility_type',
        'doctor.default_fee',
        'doctor.average_consulting_time',
      ]);

    if (searchData.services && searchData.services.length > 0) {
      queryBuilder.andWhere('doctor.services && ARRAY[:...services]', {
        services: searchData.services,
      });
    }

    if (searchData.speciality && searchData.speciality.length > 0) {
      queryBuilder.andWhere('doctor.speciality && ARRAY[:...speciality]', {
        speciality: searchData.speciality,
      });
    }

    if (searchData.facility_name) {
      queryBuilder.andWhere('doctor.facility_name = :facility_name', {
        facility_name: searchData.facility_name,
      });
    }

    const doctors = await queryBuilder.getMany();

    const mappedDoctors = doctors.map((doctor) => ({
      id: doctor.user_id,
      username: doctor.user.username,
      services: doctor.services,
      speciality: doctor.speciality,
      experience: doctor.experience,
      facility_name: doctor.facility_name,
      facility_location: doctor.facility_location,
      facility_type: doctor.facility_type,
      default_fee: doctor.default_fee,
      average_consulting_time: doctor.average_consulting_time,
    }));

    console.log(mappedDoctors);

    return mappedDoctors;
  }
}
