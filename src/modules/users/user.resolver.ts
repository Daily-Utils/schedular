import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGraphQL } from './dtos/user.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserGraphQL])
  async findAll() {
    return this.usersService.findAll();
  }
}
