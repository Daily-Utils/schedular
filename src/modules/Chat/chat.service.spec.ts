import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatMessageInput } from './dtos/chatinput.dto';
import { UpdateChatMessageInput } from './dtos/updatedchat.dto';
import { NotFoundException } from '@nestjs/common';
import { ChatType } from './chat.enum';

describe('ChatService', () => {
  let service: ChatService;
  let repository: Repository<Chat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Chat),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    repository = module.get<Repository<Chat>>(getRepositoryToken(Chat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChatMessage', () => {
    it('should create and return a chat message', async () => {
      const createChatMessageInput: CreateChatMessageInput = {
        patient_user_id: 1,
        doctor_user_id: 2,
        type: ChatType.SIMPLE,
        message: 'Hello, Doctor!',
      };

      const savedChatMessage = {
        chat_id: 1,
        ...createChatMessageInput,
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedChatMessage as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedChatMessage as any);

      const result = await service.createChatMessage(createChatMessageInput);

      expect(result).toEqual({
        chat_id: savedChatMessage.chat_id,
        patient_user_id: savedChatMessage.patient_user_id,
        doctor_user_id: savedChatMessage.doctor_user_id,
        type: savedChatMessage.type,
        message: savedChatMessage.message,
      });
    });
  });

  describe('updateChatMessage', () => {
    it('should update and return the chat message', async () => {
      const chat_id = 1;
      const updateChatMessageInput: UpdateChatMessageInput = {
        message: 'Updated message',
      };

      const existingChatMessage = {
        chat_id,
        patient_user_id: 1,
        doctor_user_id: 2,
        type: 'text',
        message: 'Hello, Doctor!',
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(existingChatMessage as any);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...existingChatMessage,
        message: updateChatMessageInput.message,
      } as any);

      const result = await service.updateChatMessage(
        chat_id,
        updateChatMessageInput,
      );

      expect(result.message).toEqual(updateChatMessageInput.message);
    });

    it('should throw NotFoundException if chat message not found', async () => {
      const chat_id = 1;
      const updateChatMessageInput: UpdateChatMessageInput = {
        message: 'Updated message',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateChatMessage(chat_id, updateChatMessageInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getChatMessages', () => {
    it('should return chat messages between a patient and doctor', async () => {
      const patient_user_id = 1;
      const doctor_user_id = 2;

      const chatMessages = [
        {
          chat_id: 1,
          patient_user_id,
          doctor_user_id,
          type: 'text',
          message: 'Hello, Doctor!',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(chatMessages as any);

      const result = await service.getChatMessages(
        patient_user_id,
        doctor_user_id,
      );

      expect(result).toEqual(chatMessages);
    });
  });

  describe('deleteChat', () => {
    it('should delete the chat message', async () => {
      const chat_id = 1;

      const chatMessage = {
        chat_id,
        patient_user_id: 1,
        doctor_user_id: 2,
        type: 'text',
        message: 'Hello, Doctor!',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(chatMessage as any);
      jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

      await service.deleteChat(chat_id);

      expect(repository.delete).toHaveBeenCalledWith(chat_id);
    });

    it('should throw an error if chat message not found', async () => {
      const chat_id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteChat(chat_id)).rejects.toThrow(Error);
    });
  });
});
