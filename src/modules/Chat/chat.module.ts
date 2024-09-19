import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "./chat.entity";
import { ChatResolver } from "./chat.resolver";
import { ChatSubscriptionService } from "./chatsubscriptionservice";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
    ],
    providers: [ChatService, ChatResolver, ChatSubscriptionService,]
})
export class ChatModule {}