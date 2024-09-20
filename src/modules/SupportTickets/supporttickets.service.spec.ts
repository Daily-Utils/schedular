import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsService } from './supporttickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupportTickets } from './supporttickets.entity';
import { Repository } from 'typeorm';
import { CreateSupportTicketDto } from './dtos/createSupportTicket.dto';
import { UpdateSupportDTO } from './dtos/updateSupportDTO';

describe('SupportTicketsService', () => {
  let service: SupportTicketsService;
  let repository: Repository<SupportTickets>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportTicketsService,
        {
          provide: getRepositoryToken(SupportTickets),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SupportTicketsService>(SupportTicketsService);
    repository = module.get<Repository<SupportTickets>>(
      getRepositoryToken(SupportTickets),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSupportTicket', () => {
    it('should create and save a support ticket', async () => {
      const createSupportTicketDto: CreateSupportTicketDto = {
        // Add necessary properties here
        patient_user_id: 1,
        message: 'Test message',
        status: 'open',
      };
      const savedTicket = { id: 1, ...createSupportTicketDto };

      jest.spyOn(repository, 'create').mockReturnValue(savedTicket as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTicket as any);

      expect(await service.createSupportTicket(createSupportTicketDto)).toEqual(
        savedTicket,
      );
      expect(repository.create).toHaveBeenCalledWith(createSupportTicketDto);
      expect(repository.save).toHaveBeenCalledWith(createSupportTicketDto);
    });
  });

  describe('getAllSupportTickets', () => {
    it('should retrieve all support tickets for a given patient_user_id', async () => {
      const patient_user_id = 1;
      const tickets = [{ id: 1, patient_user_id }];

      jest.spyOn(repository, 'find').mockResolvedValue(tickets as any);

      expect(await service.getAllSupportTickets(patient_user_id)).toEqual(
        tickets,
      );
      expect(repository.find).toHaveBeenCalledWith({
        where: { patient_user_id },
      });
    });
  });

  describe('updateSupportTicketStatus', () => {
    it('should update the status of a support ticket', async () => {
      const updateSupportDTO: UpdateSupportDTO = {
        id: 1,
        patient_user_id: 1,
        message: 'Test message',
        status: 'open',
        // Add necessary properties here
      };
      const updateResult = { affected: 1 };

      jest.spyOn(repository, 'update').mockResolvedValue(updateResult as any);

      expect(await service.updateSupportTicketStatus(updateSupportDTO)).toEqual(
        updateResult,
      );
      expect(repository.update).toHaveBeenCalledWith(
        { id: updateSupportDTO.id },
        {
          message: updateSupportDTO.message,
          status: updateSupportDTO.status,
        },
      );
    });
  });

  describe('deleteSupportTicket', () => {
    it('should delete a support ticket by ID', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult as any);

      expect(await service.deleteSupportTicket(id)).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
