import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './roles.entity';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: Repository<Roles>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Roles),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesRepository = module.get<Repository<Roles>>(getRepositoryToken(Roles));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPermisionsForRole', () => {
    it('should return role entity for a given role', async () => {
      const role = 'admin';
      const roleEntity = {
        roles_name: role,
        appointment_permission: [],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(roleEntity);

      const result = await service.getPermisionsForRole(role);

      expect(result).toEqual(roleEntity);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { roles_name: role },
      });
    });

    it('should return null if role does not exist', async () => {
      const role = 'nonexistent';
      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getPermisionsForRole(role);

      expect(result).toBeNull();
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { roles_name: role },
      });
    });
  });

  describe('checkWhetherPermissionExists', () => {
    it('should return true if permission exists', async () => {
      const role = 'admin';
      const permission = 'create';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: [permission],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);

      const result = await service.checkWhetherPermissionExists(
        role,
        permission,
        category,
      );

      expect(result).toBe(true);
    });

    it('should return false if permission does not exist', async () => {
      const role = 'admin';
      const permission = 'nonexistent';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: ['create'],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);

      const result = await service.checkWhetherPermissionExists(
        role,
        permission,
        category,
      );

      expect(result).toBe(false);
    });

    it('should return false if role does not exist', async () => {
      const role = 'nonexistent';
      const permission = 'create';
      const category = 'appointment_permission';
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(null);

      const result = await service.checkWhetherPermissionExists(
        role,
        permission,
        category,
      );

      expect(result).toBe(false);
    });
  });

  describe('addPermissionToRole', () => {
    it('should return 401 if role is admin', async () => {
      const result = await service.addPermissionToRole(
        'admin',
        'create',
        'appointment_permission',
      );

      expect(result).toEqual({
        status: 401,
        message: 'Admin role cannot be modified',
      });
    });

    it('should add permission to role if it does not exist', async () => {
      const role = 'patient';
      const permission = 'create';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: [],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);
      jest.spyOn(rolesRepository, 'save').mockResolvedValue(roleEntity);

      const result = await service.addPermissionToRole(
        role,
        permission,
        category,
      );

      expect(result).toEqual({
        status: 200,
        message: 'Permission added successfully',
      });
      expect(roleEntity[category]).toContain(permission);
      expect(rolesRepository.save).toHaveBeenCalledWith(roleEntity);
    });

    it('should return 201 if permission already exists', async () => {
      const role = 'patient';
      const permission = 'create';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: [permission],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);

      const result = await service.addPermissionToRole(
        role,
        permission,
        category,
      );

      expect(result).toEqual({
        status: 201,
        message: 'Permission already exists',
      });
    });

    it('should return null if role does not exist', async () => {
      const role = 'nonexistent';
      const permission = 'create';
      const category = 'appointment_permission';
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(null);

      const result = await service.addPermissionToRole(
        role,
        permission,
        category,
      );

      expect(result).toBeNull();
    });
  });

  describe('removePermissionFromRole', () => {
    it('should return 401 if role is admin', async () => {
      const result = await service.removePermissionFromRole(
        'admin',
        'create',
        'appointment_permission',
      );

      expect(result).toEqual({
        status: 401,
        message: 'Admin role cannot be modified',
      });
    });

    it('should remove permission from role if it exists', async () => {
      const role = 'patient';
      const permission = 'create';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: [permission],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);
      jest.spyOn(rolesRepository, 'save').mockResolvedValue(roleEntity);

      const result = await service.removePermissionFromRole(
        role,
        permission,
        category,
      );

      expect(result).toEqual({
        status: 200,
        message: 'Permission removed successfully',
      });
      expect(roleEntity[category]).not.toContain(permission);
      expect(rolesRepository.save).toHaveBeenCalledWith(roleEntity);
    });

    it('should return 201 if permission does not exist', async () => {
      const role = 'patient';
      const permission = 'nonexistent';
      const category = 'appointment_permission';
      const roleEntity = {
        roles_name: role,
        appointment_permission: ['create'],
        support_tickets_permissions: [],
        feedback_permission: [],
        users: [],
      };
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(roleEntity);

      const result = await service.removePermissionFromRole(
        role,
        permission,
        category,
      );

      expect(result).toEqual({
        status: 201,
        message: 'Permission does not exist',
      });
    });

    it('should return null if role does not exist', async () => {
      const role = 'nonexistent';
      const permission = 'create';
      const category = 'appointment_permission';
      jest.spyOn(service, 'getPermisionsForRole').mockResolvedValue(null);

      const result = await service.removePermissionFromRole(
        role,
        permission,
        category,
      );

      expect(result).toBeNull();
    });
  });
});
