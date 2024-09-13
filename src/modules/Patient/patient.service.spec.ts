import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePatientDto } from './dtos/patient.dtos';
import { UpdatePatientDto } from './dtos/update_patient.dto';

describe('PatientService', () => {
  let service: PatientService;
  let patientRepository: Repository<Patient>;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPatientForUser', () => {
    it('should create a patient for a user', async () => {
      const createPatientDto: CreatePatientDto = {
        user_id: 1,
        weight: 70,
        blood_group: 'A+',
        health_issues: ['diabetes'],
        family_member: [],
        relation: [],
      };

      const patient = { ...createPatientDto, id: 1 };

      jest.spyOn(patientRepository, 'create').mockReturnValue(patient as any);
      jest.spyOn(patientRepository, 'save').mockResolvedValue(patient as any);

      expect(await service.createPatientForUser(createPatientDto)).toEqual(
        patient,
      );
    });
  });

  describe('getPatientByUserId', () => {
    it('should return a patient by user id', async () => {
      const patient = {
        user_id: 1,
        user: { username: 'user1', age: 30 },
        weight: 70,
        blood_group: 'A+',
        health_issues: ['diabetes'],
      };

      jest.spyOn(patientRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(patient),
      } as any);

      expect(await service.getPatientByUserId(1)).toEqual({
        id: patient.user_id,
        username: patient.user.username,
        age: patient.user.age,
        weight: patient.weight,
        blood_group: patient.blood_group,
        health_issues: patient.health_issues,
      });
    });
  });

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const patients = [
        {
          user_id: 1,
          user: { username: 'user1', age: 30 },
          weight: 70,
          blood_group: 'A+',
          health_issues: ['diabetes'],
        },
      ];

      jest.spyOn(patientRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(patients),
      } as any);

      expect(await service.getAllPatients()).toEqual([
        {
          id: patients[0].user_id,
          username: patients[0].user.username,
          age: patients[0].user.age,
          weight: patients[0].weight,
          blood_group: patients[0].blood_group,
          health_issues: patients[0].health_issues,
        },
      ]);
    });
  });

  describe('modifyPatientDetails', () => {
    it('should modify patient details', async () => {
      const updatePatientDto: UpdatePatientDto = {
        weight: 75,
        blood_group: 'B+',
        health_issues: ['hypertension'],
      };

      const patient = {
        user_id: 1,
        weight: 70,
        blood_group: 'A+',
        health_issues: ['diabetes'],
      };

      jest
        .spyOn(patientRepository, 'findOne')
        .mockResolvedValue(patient as any);
      jest
        .spyOn(patientRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(patientRepository, 'findOne')
        .mockResolvedValue({ ...patient, ...updatePatientDto } as any);

      expect(await service.modifyPatientDetails(1, updatePatientDto)).toEqual({
        user_id: 1,
        weight: 75,
        blood_group: 'B+',
        health_issues: ['hypertension'],
      });
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient by user id', async () => {
      await service.deletePatient(1);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
