import {  OnModuleInit, Logger } from '@nestjs/common';
import { createClient, Client } from 'graphql-ws';
import { print } from 'graphql/language/printer';
import gql from 'graphql-tag';
import WebSocket from 'ws';
import { ChatService } from './chat.service'; 

export class ChatSubscriptionService implements OnModuleInit {
  private readonly logger = new Logger(ChatSubscriptionService.name);

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    // Create the WebSocket client with WebSocket implementation
    const wsClient: Client = createClient({
      webSocketImpl: WebSocket,  // Pass the WebSocket implementation from 'ws'  
      url: 'ws://localhost:3000/graphql', // Ensure this is the correct URL
    });

    const subscriptionQuery = gql`
      subscription {
        newMessage {
          id
          patient_user_id
          doctor_user_id
          message
          type
          created_at
        }
      }
    `;

    wsClient.subscribe(
      {
        query: print(subscriptionQuery),
      },
      {
        next: async (data) => {
          this.logger.log('New message received:', data);

          // Call a service method to save the message to the database
          const newMessage = data.data.newMessage;
          await this.chatService.saveMessage(newMessage); // Ensure you have this method in ChatService
        },
        error: (err) => this.logger.error('Subscription error:', err),
        complete: () => this.logger.log('Subscription complete'),
      }
    );
  }
}




