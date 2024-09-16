import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SupportTicketService } from './supporttickets.service';
import { SupportTickets } from './supporttickets.entity';
import { CreateSupportTicketInput } from './dtos/supporttickets.dto';
import { UpdateSupportTicketInput } from './dtos/updatesupporttickets.dto';

@Resolver(() => SupportTickets)
export class SupportTicketResolver {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  // Mutation to create a new support ticket
  @Mutation(() => SupportTickets)
  createSupportTicket(
    @Args('createSupportTicketInput') createSupportTicketInput: CreateSupportTicketInput,
  ): Promise<SupportTickets> {
    return this.supportTicketService.createSupportTicket(createSupportTicketInput);
  }

  // Mutation to update a support ticket status
  @Mutation(() => SupportTickets)
  updateSupportTicket(
    @Args('id') id: number,
    @Args('updateSupportTicketInput') updateSupportTicketInput: UpdateSupportTicketInput,
  ): Promise<SupportTickets> {
    return this.supportTicketService.updateSupportTicket(id, updateSupportTicketInput);
  }

  // Query to find a support ticket by ID
  @Query(() => SupportTickets, { nullable: true })
  getSupportTicket(@Args('id') id: number): Promise<SupportTickets> {
    return this.supportTicketService.findOne(id);
  }
}
