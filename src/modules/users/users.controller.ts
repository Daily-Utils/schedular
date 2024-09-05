import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.entity';
import { UserInterface } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<UserInterface[]> {
        return this.usersService.findAll();
    }

    @Get('dummy')
    async dummy() {
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
