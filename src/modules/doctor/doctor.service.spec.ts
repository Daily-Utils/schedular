import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { CreateDoctorDto } from './dtos/doctor.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';
import { searchDTO } from './dtos/search.dto';

describe('DoctorService', () => {
  let service: DoctorService;
  let doctorRepository: Repository<Doctor>;
  let userService: UsersService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            deleteUser: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get<Repository<Doctor>>(
      getRepositoryToken(Doctor),
    );
    userService = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDoctorForUser', () => {
    it('should create a doctor for a user', async () => {
      const createDoctorDto: CreateDoctorDto = {
        user_id: 1,
        services: ['consulting'],
        speciality: ['cardiology'],
        default_fee: 100,
        average_consulting_time: '30',
        facility_name: 'Clinic',
        experience: 1,
        facility_type: 'clinic',
        facility_location: 'Location',
      };

      const doctor = { ...createDoctorDto, id: 1 };

      jest.spyOn(doctorRepository, 'create').mockReturnValue(doctor as any);
      jest.spyOn(doctorRepository, 'save').mockResolvedValue(doctor as any);

      expect(await service.createDoctorForUser(createDoctorDto)).toEqual(
        doctor,
      );
    });
  });

  describe.only('getSingleDoctorById', () => {
    it('should return a single doctor by id', async () => {
      const doctor = {
        id: 1,
        user_id: 1,
        user: { username: 'user1' },
        services: ['consulting'],
        speciality: ['cardiology'],
        experience: 1,
        default_fee: 100,
        average_consulting_time: '30',
        facility_name: 'Clinic',
        facility_type: 'clinic',
        facility_location: 'Location',
        timings: [],
      };

      jest.spyOn(doctorRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(doctor),
      } as any);

      expect(await service.getSingleDoctorById(1)).toEqual({
        id: doctor.user_id,
        username: doctor.user.username,
        services: doctor.services,
        speciality: doctor.speciality,
        experience: doctor.experience, // Ensure experience is included
        default_fee: doctor.default_fee,
        average_consulting_time: doctor.average_consulting_time,
        facility_name: doctor.facility_name,
        facility_type: doctor.facility_type,
        facility_location: doctor.facility_location,
        timings: doctor.timings,
      });
    });
  });

  describe('getDoctors', () => {
    it('should return all doctors', async () => {
      const doctors = [
        {
          id: 1,
          user_id: 1,
          user: { id: 1, username: 'user1' },
        },
      ];

      jest.spyOn(doctorRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(doctors),
      } as any);

      expect(await service.getDoctors()).toEqual({
        doctors: [
          {
            id: doctors[0].user_id,
            username: doctors[0].user.username,
          },
        ],
      });
    });
  });

  describe('updateDoctorById', () => {
    it('should update a doctor by id', async () => {
      const updateDoctorDto: UpdateDoctorDto = {
        services: ['consulting'],
        speciality: ['cardiology'],
        default_fee: 100,
        average_consulting_time: '30',
        facility_name: 'Clinic',
        facility_type: 'clinic',
        facility_location: 'Location',
      };

      jest
        .spyOn(doctorRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      expect(await service.updateDoctorById(1, updateDoctorDto)).toEqual({
        affected: 1,
      });
    });
  });

  describe.skip('deleteDoctorById', () => {
    it('should delete a doctor by id', async () => {
      const mockEntityManager = {
        delete: jest.fn(),
      };

      //   jest
      //     .spyOn(dataSource, 'transaction')
      //     .mockImplementation(
      //       async (cb: (entityManager: any) => Promise<void>) => {
      //         await cb(mockEntityManager);
      //       },
      //     );

      await service.deleteDoctorById(1);

      expect(userService.deleteUser).toHaveBeenCalledWith(1, mockEntityManager);
    });
  });

  describe('searchDoctors', () => {
    it('should search doctors based on search criteria', async () => {
      const searchData: searchDTO = {
        services: ['consulting'],
        speciality: ['cardiology'],
        facility_name: 'Clinic',
      };

      const doctors = [
        {
          user_id: 1,
          user: { username: 'user1' },
          services: ['consulting'],
          speciality: ['cardiology'],
          facility_name: 'Clinic',
          facility_location: 'Location',
          facility_type: 'clinic',
          default_fee: 100,
          average_consulting_time: '30',
        },
      ];

      jest.spyOn(doctorRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(doctors),
      } as any);

      expect(await service.searchDoctors(searchData)).toEqual([
        {
          id: doctors[0].user_id,
          username: doctors[0].user.username,
          services: doctors[0].services,
          speciality: doctors[0].speciality,
          facility_name: doctors[0].facility_name,
          facility_location: doctors[0].facility_location,
          facility_type: doctors[0].facility_type,
          default_fee: doctors[0].default_fee,
          average_consulting_time: doctors[0].average_consulting_time,
        },
      ]);
    });
  });
});
