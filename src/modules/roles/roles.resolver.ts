import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleInput, RoleOutput, RoleOutputForModification } from './dto/role.dto';
import { RolePermissionVerificationInput } from './dto/rolePermission.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(RolesGuard)
  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => RoleOutput) // Updated return type to an array of strings
  async findAllPermissionForRoles(
    @Args('roleInput') inputDto: RoleInput,
    @Context() context: any,
  ) {
    return this.rolesService.getPermisionsForRole(inputDto.role_name);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => Boolean)
  async checkWhetherPermissionExists(
    @Args('rolePermissionInput') inputDto: RolePermissionVerificationInput,
    @Context() context: any,
  ) {
    return this.rolesService.checkWhetherPermissionExists(
      inputDto.role_name,
      inputDto.permission,
      inputDto.category,
    );
  }

  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => RoleOutputForModification)
  async addPermissionToRole(
    @Args('rolePermissionInput') inputDto: RolePermissionVerificationInput,
    @Context() context: any,
  ) {
    return this.rolesService.addPermissionToRole(
      inputDto.role_name,
      inputDto.permission,
      inputDto.category,
    );
  }

  @UseGuards(RolesGuard)
  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => RoleOutputForModification)
  async removePermissionFromRole(
    @Args('rolePermissionInput') inputDto: RolePermissionVerificationInput,
    @Context() context: any,
  ) {
    return this.rolesService.removePermissionFromRole(
      inputDto.role_name,
      inputDto.permission,
      inputDto.category,
    );
  }
}
