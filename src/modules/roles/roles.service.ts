import { Injectable } from '@nestjs/common';
import { Roles } from './roles.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async getPermisionsForRole(role: string) {
    return await this.rolesRepository.findOne({
      where: { roles_name: role },
    });
  }

  async checkWhetherPermissionExists(
    role: string,
    permission: string,
    category: string,
  ) {
    const roleEntity = await this.getPermisionsForRole(role);
    if (!roleEntity) {
      return false;
    }

    return roleEntity[category].includes(permission);
  }

  async addPermissionToRole(
    role: string,
    permission: string,
    category: string,
  ) {
    if (role === 'admin') {
      return {
        status: 401,
        message: 'Admin role cannot be modified',
      };
    }

    const roleEntity = await this.getPermisionsForRole(role);
    if (!roleEntity) {
      return null;
    }

    if (!roleEntity[category].includes(permission)) {
      roleEntity[category].push(permission);
    } else {
      return {
        status: 201,
        message: 'Permission already exists',
      };
    }

    await this.rolesRepository.save(roleEntity);
    return {
      status: 200,
      message: 'Permission added successfully',
    };
  }

  async removePermissionFromRole(
    role: string,
    permission: string,
    category: string,
  ) {
    if (role === 'admin') {
      return {
        status: 401,
        message: 'Admin role cannot be modified',
      };
    }

    const roleEntity = await this.getPermisionsForRole(role);
    if (!roleEntity) {
      return null;
    }

    if (roleEntity[category].includes(permission)) {
      roleEntity[category] = roleEntity[category].filter(
        (perm) => perm !== permission,
      );
    } else {
      return {
        status: 201,
        message: 'Permission does not exist',
      };
    }

    await this.rolesRepository.save(roleEntity);
    return {
      status: 200,
      message: 'Permission removed successfully',
    };
  }
}
