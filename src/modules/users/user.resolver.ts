import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGraphQL } from './schemas/user.model';
import { UserInterface } from './interfaces/user.interface';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserGraphQL])
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => String)
  async dummy(): Promise<{ success: boolean; message: string }> {
    // Simulate a failure scenario
    const randomNumber = Math.random(); // Generate a random number between 0 and 1
    if (randomNumber < 0.5) {
      // Simulate a failure scenario by returning a failure response
      return { success: false, message: 'Failed to perform operation' };
    } else {
      // Simulate a successful scenario
      return { success: true, message: 'Operation succeeded' };
    }
  }
}
