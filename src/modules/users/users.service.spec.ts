import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from '../roles/roles.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../Patient/patient.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let doctorRepository: Repository<any>;
  let patientRepository: Repository<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: 'DoctorRepository',
          useClass: Repository,
        },
        {
          provide: 'PatientRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    doctorRepository = module.get<Repository<any>>('DoctorRepository');
    patientRepository = module.get<Repository<any>>('PatientRepository');
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const registerDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        sex: 'male',
        age: 30,
        role: 'patient',
        phone: '9657972133',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const newUser: User = {
        id: 1,
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        sex: registerDto.sex,
        age: registerDto.age,
        role: registerDto.role,
        phone: registerDto.phone,
        doctor_id: null,
        patient_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: new Roles,
        doctor: new Doctor,
        patient: new Patient
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);
      jest.spyOn(doctorRepository, 'create').mockReturnValue({});
      jest.spyOn(patientRepository, 'create').mockReturnValue({});

      const result = await service.createUser(registerDto);

      expect(result).toEqual(newUser);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const loginDto = {
        username: 'user1',
        password: 'password123',
        phone: '9657972133',
      };
      const user: User = {
        id: 1,
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
        sex: 'registerDto.sex,',
        age: 23,
        email: 'registerDto.email',
        role: 'registerDto.role',
        phone: 'registerDto.phone',
        doctor_id: null,
        patient_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: new Roles(),
        doctor: new Doctor(),
        patient: new Patient(),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual(user);
    });

    it('should return null if credentials are invalid', async () => {
      const loginDto = {
        username: 'user1',
        password: 'wrongpassword',
        phone: '9657972133',
      };
      const user: User = {
        id: 1,
        username: 'user1',
        password: await bcrypt.hash('password123', 10),
        sex: 'registerDto.sex,',
        age: 23,
        email: 'registerDto.email',
        role: 'registerDto.role',
        phone: 'registerDto.phone',
        doctor_id: null,
        patient_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: new Roles(),
        doctor: new Doctor(),
        patient: new Patient(),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });
  });
});
