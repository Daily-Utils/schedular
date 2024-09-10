import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGraphQL } from './schemas/user.model';
import { UserInterface } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserGraphQL])
  @UseGuards()
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => String)
  async dummy() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      return JSON.stringify({ success: false, message: 'Failed to perform operation' });
    } else {
      return JSON.stringify({ success: true, message: 'Operation succeeded' });
    }
  }
}
