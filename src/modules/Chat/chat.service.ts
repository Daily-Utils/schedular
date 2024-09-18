import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity'; // Assuming you have a chat entity defined
import { CreateChatMessageInput } from './dtos/chatinput.dto';
import { UpdateChatMessageInput } from './dtos/updatedchat.dto';
import { ChatMessageOutput } from './dtos/outputchat.dto';
import { DeleteChat } from './dtos/chatdelete.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChatMessage(createChatMessageInput: CreateChatMessageInput): Promise<ChatMessageOutput> {
    const chatMessage = this.chatRepository.create({
      ...createChatMessageInput,
    });

    const savedChatMessage = await this.chatRepository.save(chatMessage);

    // Return the chat message in the expected output format
    return {
      chat_id: savedChatMessage.chat_id,
      patient_user_id: savedChatMessage.patient_user_id,
      doctor_user_id: savedChatMessage.doctor_user_id,
      type: savedChatMessage.type,
      message: savedChatMessage.message,
    };
  }

  // Update an existing chat message
  async updateChatMessage(chat_id: number, updateChatMessageInput: UpdateChatMessageInput) {
    const chat = await this.chatRepository.findOne({ where: { chat_id } });
    if (!chat) {
      throw new NotFoundException('Chat message not found');
    }

    if (updateChatMessageInput.message) {
        chat.message = updateChatMessageInput.message;
      }
    return await this.chatRepository.save(chat);
  }

  // Get chat messages between a patient and doctor
  async getChatMessages(patient_user_id: number, doctor_user_id: number) {
    const messages = await this.chatRepository.find({
      where: { patient_user_id: patient_user_id , doctor_user_id: doctor_user_id },
    });
  
    // You may need to map `Chat` entities to `ChatMessageOutput`
    return messages.map((message) => ({
      chat_id: message.chat_id,
      patient_user_id: message.patient_user_id,
      doctor_user_id: message.doctor_user_id,
      type: message.type,
      message: message.message,
    }));
  }

  async deleteChat(chat_id: number) {
    const chatMessage = await this.chatRepository.findOne({ where: { chat_id: chat_id } });
    if (!chatMessage) {
      throw new Error('Chat message not found');
    }
    await this.chatRepository.delete(chat_id);
  }
  
  
}
