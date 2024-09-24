import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Chat } from './chat.entity';
import { CreateChatMessageInput } from './dtos/chatinput.dto';
import { UpdateChatMessageInput } from './dtos/updatedchat.dto';
import { ChatMessageOutput } from './dtos/outputchat.dto';

const pubSub = new PubSub();

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  // Create a new chat message and publish the event for subscriptions
  async createChatMessage(
    createChatMessageInput: CreateChatMessageInput,
  ): Promise<ChatMessageOutput> {
    const chatMessage = this.chatRepository.create({
      ...createChatMessageInput,
    });

    const savedChatMessage = await this.chatRepository.save(chatMessage);

    const outputMessage: ChatMessageOutput = {
      chat_id: savedChatMessage.chat_id,
      patient_user_id: savedChatMessage.patient_user_id,
      doctor_user_id: savedChatMessage.doctor_user_id,
      type: savedChatMessage.type,
      message: savedChatMessage.message,
    };

    // Publish the new message event for the subscription
    await pubSub.publish('newMessage', { newMessage: outputMessage });

    return outputMessage;
  }

  // Save a new message from WebSocket subscription
  async saveMessage(newMessage: any) {
    const chatMessage = this.chatRepository.create({
      patient_user_id: newMessage.patient_user_id,
      doctor_user_id: newMessage.doctor_user_id,
      type: newMessage.type,
      message: newMessage.message,
    });

    await this.chatRepository.save(chatMessage);
  }

  // Update an existing chat message
  async updateChatMessage(
    chat_id: number,
    updateChatMessageInput: UpdateChatMessageInput,
  ) {
    const chat = await this.chatRepository.findOne({ where: { chat_id } });
    if (!chat) {
      throw new NotFoundException('Chat message not found');
    }

    if (updateChatMessageInput.message) {
      chat.message = updateChatMessageInput.message;
    }

    const updatedChat = await this.chatRepository.save(chat);

    const outputMessage: ChatMessageOutput = {
      chat_id: updatedChat.chat_id,
      patient_user_id: updatedChat.patient_user_id,
      doctor_user_id: updatedChat.doctor_user_id,
      type: updatedChat.type,
      message: updatedChat.message,
    };

    // Publish the updated message event for the subscription
    await pubSub.publish('updatedMessage', { updatedMessage: outputMessage });

    return outputMessage;
  }

  // Get chat messages between a patient and doctor
  async getChatMessages(patient_user_id: number, doctor_user_id: number) {
    const messages = await this.chatRepository.find({
      where: { patient_user_id, doctor_user_id },
    });

    return messages.map((message) => ({
      chat_id: message.chat_id,
      patient_user_id: message.patient_user_id,
      doctor_user_id: message.doctor_user_id,
      type: message.type,
      message: message.message,
    }));
  }

  // Delete a chat message
  async deleteChat(chat_id: number) {
    const chatMessage = await this.chatRepository.findOne({
      where: { chat_id },
    });
    if (!chatMessage) {
      throw new Error('Chat message not found');
    }
    await this.chatRepository.delete(chat_id);
  }
}
