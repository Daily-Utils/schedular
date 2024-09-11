import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { PERMISSION_KEY, ROLES_KEY } from './roles.decorator';
import { PermissionsService } from '../auth/permission.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard {
  constructor(
    private reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const permission = this.reflector.getAllAndOverride<{
      check_permission: boolean;
      permission_category: string;
      permission_type: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);


    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext();
    const { req } = ctx;
    const user = req.user;
    
    if (permission && permission.check_permission) {
      const hasPermission = await this.permissionsService.hasPermission(
        user.user_assignment,
        requiredRoles,
        true,
        permission.permission_category,
        permission.permission_type,
      );
      if (!hasPermission) {
        return false;
      }
    }

    return this.permissionsService.hasPermission(
      user.user_assignment,
      requiredRoles,
      false,
      '',
      '',
    );
  }
}
