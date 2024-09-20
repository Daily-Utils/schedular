import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGraphQL } from './dtos/user.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [UserGraphQL])
  async findAll() {
    return this.usersService.findAll();
  }
}
