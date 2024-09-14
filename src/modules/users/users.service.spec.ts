import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../Patient/patient.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Appointment } from '../appointment/appointment.entity';
import { Doctor } from '../doctor/doctor.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let doctorService: DoctorService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: DoctorService,
          useValue: {
            createDoctorForUser: jest.fn(),
          },
        },
        {
          provide: PatientService,
          useValue: {
            createPatientForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    doctorService = module.get<DoctorService>(DoctorService);
    patientService = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const user = new User();
      user.username = username;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(await service.findByUsername(username)).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new User(), new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        sex: 'male',
        age: 30,
        role: 'doctor',
        phone: '1234567890',
        services: ['General'],
        speciality: ['General'],
        default_fee: 100,
        average_consulting_time: "30",
        facility_name: 'Test Facility',
        facility_type: 'Clinic',
        facility_location: 'Test Location',
      };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const savedUser = new User();
      savedUser.id = 1;
      savedUser.username = registerDto.username;
      savedUser.email = registerDto.email;
      savedUser.password = hashedPassword;
      savedUser.sex = registerDto.sex;
      savedUser.age = registerDto.age;
      savedUser.role = registerDto.role;
      savedUser.phone = registerDto.phone;

      jest.spyOn(userRepository, 'create').mockReturnValue(savedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

      const doctor: Doctor = {
        id: 1,
        services: ['General'],
        speciality: ['General'],
        default_fee: 100,
        experience: 0,
        average_consulting_time: '30',
        facility_name: 'Test Facility',
        facility_type: 'Clinic',
        user: savedUser,
        facility_location: 'Test Location',
        appointments: [],
        chat: [],
        timings: [],
        user_id: 0
      };

      jest
        .spyOn(doctorService, 'createDoctorForUser')
        .mockResolvedValue(doctor);
      
      const result = await service.createUser(registerDto);
      
      expect(result).toEqual(savedUser);
      expect(doctorService.createDoctorForUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const loginDto = { username: 'testuser', password: 'password', phone: '1234567890' };
      const user = new User();
      user.username = loginDto.username;
      user.password = await bcrypt.hash(loginDto.password, 10);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      expect(await service.validateUser(loginDto)).toEqual(user);
    });

    it('should return null if credentials are invalid', async () => {
      const loginDto = { username: 'testuser', password: 'password', phone: '1234567890' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      expect(await service.validateUser(loginDto)).toBeNull();
    });
  });
});
