import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketService } from './supporttickets.service';
import { SupportTicketResolver } from './supporttickets.resolver';
import { SupportTickets } from './supporttickets.entity';
import { PatientModule } from '../Patient/patient.module';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTickets]), PatientModule],
  providers: [SupportTicketService, SupportTicketResolver],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
