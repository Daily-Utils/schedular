import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleInput, RoleOutput, RoleOutputForModification } from './dto/role.dto';
import { RolePermissionVerificationInput } from './dto/rolePermission.dto';
import { OpenForDevelopment } from '../auth/auth.decorator';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @OpenForDevelopment()
  @Query(() => RoleOutput) // Updated return type to an array of strings
  async findAllPermissionForRoles(
    @Args('roleInput') inputDto: RoleInput,
    @Context() context: any,
  ) {
    return this.rolesService.getPermisionsForRole(inputDto.role_name);
  }

  @OpenForDevelopment()
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

  @OpenForDevelopment()
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
}
