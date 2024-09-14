import { Module } from "@nestjs/common";
import { SupportTicketsService } from "./supporttickets.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportTickets } from "./supporttickets.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([SupportTickets]),
    ],
    providers: [SupportTicketsService],
    controllers: [],
    exports: []
})
export class SupportTicketsModule {}