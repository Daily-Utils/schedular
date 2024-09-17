import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SupportTicketsService } from './supporttickets.service';
import { Inject, Logger } from '@nestjs/common';
import {
  SupportOutputDTO,
  supportTicketCreateOutputDTO,
} from './dtos/output.dto';
import { CreateSupportTicketDto } from './dtos/createSupportTicket.dto';
import { UpdateSupportDTO } from './dtos/updateSupportDTO';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';

@Resolver()
export class SupportTicketsResolver {
  constructor(
    @Inject(SupportTicketsService)
    private supportTicketsService: SupportTicketsService,
  ) {}

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [supportTicketCreateOutputDTO])
  async getAllSupportTickets(@Args('patient_user_id') patient_user_id: number) {
    return await this.supportTicketsService.getAllSupportTickets(
      patient_user_id,
    );
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => supportTicketCreateOutputDTO)
  async createSupportTicket(
    @Args('createSupportTicket') createSupportTicket: CreateSupportTicketDto,
  ) {
    return await this.supportTicketsService.createSupportTicket(
      createSupportTicket,
    );
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => SupportOutputDTO)
  async updateSupportTicket(
    @Args('updateSupportTicket') updateSupportTicket: UpdateSupportDTO,
  ) {
    try {
      await this.supportTicketsService.updateSupportTicketStatus(
        updateSupportTicket,
      );
      return {
        status: 'Success',
        message: 'Support Ticket Updated',
      };
    } catch (error) {
      Logger.log(error);
      return {
        status: 'Failed',
        message: 'Support Ticket Update Failed',
      };
    }
  }

  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => SupportOutputDTO)
  async deleteSupportTicket(@Args('id') id: number) {
    try {
      await this.supportTicketsService.deleteSupportTicket(id);
      return {
        status: 'Success',
        message: 'Support Ticket Deleted',
      };
    } catch (error) {
      Logger.log(error);
      return {
        status: 'Failed',
        message: 'Support Ticket Delete Failed',
      };
    }

  }
}
