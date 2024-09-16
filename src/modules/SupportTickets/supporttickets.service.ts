import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTickets } from './supporttickets.entity';
import { CreateSupportTicketInput } from './dtos/supporttickets.dto';
import { UpdateSupportTicketInput } from './dtos/updatesupporttickets.dto';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTickets)
    private readonly supportTicketRepository: Repository<SupportTickets>,
  ) {}

  // Create a new support ticket
  async createSupportTicket(supportTicketData: CreateSupportTicketInput) {
    // Create support ticket with the provided data
    const supportTicket = this.supportTicketRepository.create({
      ...supportTicketData,
    });

    return this.supportTicketRepository.save(supportTicket);
  }

  // Update the status of a support ticket
  async updateSupportTicket(id: number, updateSupportTicketData: UpdateSupportTicketInput) {
    // Find the existing support ticket
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    // Update the support ticket with new data
    Object.assign(ticket, updateSupportTicketData);

    return this.supportTicketRepository.save(ticket);
  }

  // Find a support ticket by ID
  async findOne(id: number): Promise<SupportTickets> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    return ticket;
  }
}

