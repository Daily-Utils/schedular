import { Module } from '@nestjs/common';
import { SupportTicketsService } from './supporttickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTickets } from './supporttickets.entity';
import { SupportTicketsResolver } from './supporttickets.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTickets])],
  providers: [SupportTicketsService, SupportTicketsResolver],
  controllers: [],
  exports: [],
})
export class SupportTicketsModule {}
