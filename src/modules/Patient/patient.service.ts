import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dtos/patient.dtos';
import { UpdatePatientDto } from './dtos/update_patient.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ) {}

  async createPatientForUser(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create({
      ...createPatientDto,
    });
    return this.patientRepository.save(patient);
  }

  async getPatientByUserId(user_id: number) {
    const patient = await this.patientRepository.createQueryBuilder('patient')
    .leftJoinAndSelect('patient.user', 'user')
    .select([
      'patient.user_id',
      'user.username',
      'user.age',
      'patient.weight',
      'patient.blood_group',
      'patient.health_issues',
    ])
    .where('patient.user_id = :user_id', { user_id })
    .getOne();

    return {
      id: patient.user_id,
      username: patient.user.username,
      age: patient.user.age,
      weight: patient.weight,
      blood_group: patient.blood_group,
      health_issues: patient.health_issues
    }
  }

  async getAllPatients(){
    const patients = await this.patientRepository.createQueryBuilder('patient')
    .leftJoinAndSelect('patient.user', 'user')
    .select([
      'patient.user_id',
      'user.username',
      'user.age',
      'patient.weight',
      'patient.blood_group',
      'patient.health_issues',
    ])
    .getMany();

    const mapped_patients = patients.map((patient) => {
      return {
        id: patient.user_id,
        username: patient.user.username,
        age: patient.user.age,
        weight: patient.weight,
        blood_group: patient.blood_group,
        health_issues: patient.health_issues,
      };
    })

    return mapped_patients;
  }

  async modifyPatientDetails(user_id: number, updateDTO: UpdatePatientDto){
    const patient = await this.patientRepository.findOne({ where: { user_id } });
    if (!patient) {
      return null;
    }
    await this.patientRepository.update({ user_id }, updateDTO);
    return this.patientRepository.findOne({ where: { user_id } });
  }

  async deletePatient(user_id: number) {
    await this.userService.deleteUser(user_id);
  }
}

