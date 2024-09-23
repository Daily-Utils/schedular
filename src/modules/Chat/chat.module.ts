import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService, ChatResolver],
})
export class ChatModule {}
