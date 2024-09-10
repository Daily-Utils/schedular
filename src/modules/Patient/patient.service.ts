import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { User } from '../users/schemas/user.entity';
import { CreatePatientDto } from './dtos/patient.dtos';

@Injectable()
export class PatientService {
  constructor(@InjectRepository(Patient) private patientRepository: Repository<Patient>) {}

  async createPatientForUser(userId: number, createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...createPatientDto,
    });
    return this.patientRepository.save(patient);
  }
}

