import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity'; 
import { CreateChatMessageInput } from './dtos/chatinput.dto';
import { UpdateChatMessageInput } from './dtos/updatedchat.dto';
import { ChatMessageOutput } from './dtos/outputchat.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteChat } from './dtos/chatdelete.dto';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  // Query to get chat messages between a patient and a doctor
  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [ChatMessageOutput])
  async getChatMessages(
    @Args('patient_user_id') patient_user_id: number,
    @Args('doctor_user_id') doctor_user_id: number,
  ): Promise<ChatMessageOutput[]> {
    try {
      return await this.chatService.getChatMessages(patient_user_id, doctor_user_id);
    } catch (e) {
      Logger.error(e);
      throw new Error('Failed to retrieve chat messages');
    }
  }

  // Mutation to create a new chat message
  //@UseGuards(JwtAuthGuard)
  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ChatMessageOutput) // Use ChatMessageOutput, not CreateChatMessageInput
  async createChatMessage(
    @Args('createChatMessageInput') createChatMessageInput: CreateChatMessageInput,
  ) {
    try {
      return await this.chatService.createChatMessage(createChatMessageInput);
    } catch (e) {
      Logger.error(e);
      throw new Error('Failed to create chat message');
    }
  }
  

  // Mutation to update a chat message
  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ChatMessageOutput)  // Return the correct output type
  async updateChatMessage(
    @Args('id') id: number,
    @Args('updateChatMessageInput') updateChatMessageInput: UpdateChatMessageInput,
  ) {
    try {
      return await this.chatService.updateChatMessage(id, updateChatMessageInput);
    } catch (e) {
      Logger.error(e);
      throw new Error('Failed to update chat message');
    }
  }


  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => DeleteChat)
  async deleteChat(@Args('chat_id') chat_id: number) {
    try {
      await this.chatService.deleteChat(chat_id);
      return {
        message: 'Chat deleted successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        message: 'Failed to delete chat',
      };
    }
  }

}



