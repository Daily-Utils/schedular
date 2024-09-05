import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { UserInterface } from './interfaces/user.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {} // Mock repository
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    const result: UserInterface[] = [{ id: 1, username: 'John', email: "john@ex.com"}, { id: 2, username: 'Sam', email: "sam@ex.com" }];
    jest.spyOn(userService, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });
});
