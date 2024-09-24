import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.enum';

@Injectable()
export class PermissionsService {
  constructor(private readonly rolesService: RolesService) {}

  async hasPermission(
    user_assignment: string,
    requiredRoles: Role[],
    check_permission: boolean,
    permission_category: string,
    permission_type: string,
  ): Promise<boolean> {
    if (!check_permission) {
      return requiredRoles.some((role) => role === user_assignment);
    }
    const user = await this.rolesService.getPermisionsForRole(user_assignment);
    return user[permission_category].some(
      (permission) => permission === permission_type,
    );
  }
}
