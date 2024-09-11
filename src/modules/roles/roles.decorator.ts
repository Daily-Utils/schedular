import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const ROLES_KEY = 'roles';
export const PERMISSION_KEY = 'permission';

export const Roles = (
  roles: Role[],
  permission: {
    check_permission: boolean;
    permission_category: string;
    permission_type: string;
  },
) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(ROLES_KEY, roles)(target, key, descriptor);
    SetMetadata(PERMISSION_KEY, permission)(target, key, descriptor);
  };
};
