import { Injectable } from '@nestjs/common';
import { CreateSupportTicketDto } from './dtos/createSupportTicket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportTickets } from './supporttickets.entity';
import { Repository } from 'typeorm';
import { UpdateSupportDTO } from './dtos/updateSupportDTO';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTickets)
    private supportTicketsRepository: Repository<SupportTickets>,
  ) {}

  async createSupportTicket(createSupportTicketDto: CreateSupportTicketDto) {
    this.supportTicketsRepository.create(createSupportTicketDto);
    return await this.supportTicketsRepository.save(createSupportTicketDto);
  }

  async getAllSupportTickets(paitent_user_id: number) {
    return await this.supportTicketsRepository.find({
      where: { patient_user_id: paitent_user_id },
    });
  }

  async updateSupportTicketStatus(updateSupportDTO: UpdateSupportDTO) {
    return await this.supportTicketsRepository.update(
      { id: updateSupportDTO.id },
      {
        status: updateSupportDTO.status,
        message: updateSupportDTO.message,
      },
    );
  }

  async deleteSupportTicket(id: number) {
    return await this.supportTicketsRepository.delete(id);
  }
}
