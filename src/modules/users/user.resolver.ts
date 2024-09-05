// src/user/user.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './schemas/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from '../auth/dtos/register.dto';
import { UserInterface } from './interfaces/user.interface';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  
  

  
  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@Context() context): Promise<User> {
    const user = context.req.user; 
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async users(): Promise<UserInterface[]> {
    return this.userService.findAll();
  }

  
  @Mutation(() => User)
  async register(@Args('registerInput') registerInput: RegisterDto): Promise<User> {
    return this.userService.createUser(registerInput);
  }
}
