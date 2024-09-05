import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schemas/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, username: 'user1', email: 'user1@example.com', password: 'password123'  }];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const registerDto = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = {
        id: 1,
        ...registerDto,
        password: hashedPassword,
      };
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);

      const result = await service.createUser(registerDto);

      expect(result).toEqual(newUser);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const loginDto = { username: 'user1', password: 'password123' };
      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const loginDto = { username: 'user1', password: 'password123' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const loginDto = { username: 'user1', password: 'wrongpassword' };
      const user = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });
  });
});
