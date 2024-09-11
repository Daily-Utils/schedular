import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let doctorRepository: any;
  let patientRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'DoctorRepository',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'PatientRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    doctorRepository = module.get('DoctorRepository');
    patientRepository = module.get('PatientRepository');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          role: 'doctor',
          age: 30,
          sex: 'male',
          phone: 9657972133,
          created_at: new Date(),
          updated_at: new Date(),
          roleEntity: {
            roles_name: 'doctor',
            appointment_permission: [],
            support_tickets_permissions: [],
            feedback_permission: [],
            users: [], // Assuming users is an array, adjust as necessary
          },
        },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user and populate doctor or patient based on role', async () => {
      const registerDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'doctor', // or 'patient'
        age: 30,
        sex: 'male',
        phone: 9657972133,
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        age: 30,
        sex: 'male',
        role: 'doctor', // or 'patient'
        password: hashedPassword,
        phone: 9657972133,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: {
          roles_name: 'doctor',
          appointment_permission: [],
          support_tickets_permissions: [],
          feedback_permission: [],
          users: [], // Assuming users is an array, adjust as necessary
        }, // Assuming roleEntity is an object, adjust as necessary
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
      const loginDto = { username: 'user1', password: 'password123', phone: 9657972133 };
      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        age: 30,
        sex: 'male',
        role: 'doctor', // or 'patient'
        phone: 9657972133,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: {
          roles_name: 'doctor',
          appointment_permission: [],
          support_tickets_permissions: [],
          feedback_permission: [],
          users: [], // Assuming users is an array, adjust as necessary
        },
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const loginDto = { username: 'user1', password: 'password123' , phone: 9657972133 };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const loginDto = { username: 'user1', password: 'wrongpassword', phone: 9657972133 };
      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        age: 30,
        sex: 'male',
        role: 'doctor', // or 'patient'
        phone: 9657972133,
        created_at: new Date(),
        updated_at: new Date(),
        roleEntity: {
          roles_name: 'doctor',
          appointment_permission: [],
          support_tickets_permissions: [],
          feedback_permission: [],
          users: [], // Assuming users is an array, adjust as necessary
        },
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });
  });
});
