/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { outputAppointment } from './dtos/output.dto';
import { ResponseDTO } from '../dtos/response.dto';

import {
  createAppointmentDTO,
  updateAppointmentDTO,
  bulkUpdateDTO,
} from './dtos/appointment.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { OpenForDevelopment } from '../auth/auth.decorator';

@Resolver()
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [outputAppointment])
  async getAppointmentsForDoctor(
    @Args('doctor_user_id') doctor_user_id: number,
  ) {
    return await this.appointmentService.getAllAppointmentsForDoctor(
      doctor_user_id,
    );
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [outputAppointment])
  async getAppointmentsForPatients(
    @Args('patient_user_id') patient_user_id: number,
  ) {
    return await this.appointmentService.getAllAppointmentsForPatient(
      patient_user_id,
    );
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => outputAppointment)
  async createAppointment(
    @Args('appointment') appointment: createAppointmentDTO,
  ) {
    return await this.appointmentService.createAppointment(appointment);
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => outputAppointment)
  async getAppointmentById(@Args('id') id: number) {
    return await this.appointmentService.getAppointmentById(id);
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
  async updateAppointment(
    @Args('updateAppointmentDTO') updateAppointmentDTO: updateAppointmentDTO,
  ) {
    try {
      await this.appointmentService.updateAppointment(updateAppointmentDTO);
      return {
        status: 'success',
        message: 'Appointment updated successfully',
      };
    } catch (error) {
      Logger.error(error);
      return {
        status: 'error',
        message: `Appointment not updated: ${error.message}`,
      };
    }
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
  async deleteAppointment(@Args('id') id: number) {
    try {
      await this.appointmentService.deleteAppointment(id);
      return {
        status: 'success',
        message: 'Appointment deleted successfully',
      };
    } catch (error) {
      Logger.error(error);
      return {
        status: 'error',
        message: `Appointment not deleted: ${error.message}`,
      };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => ResponseDTO)
  async bulkUpdateAppointments(@Args('bulkUpdate') bulkUpdate: bulkUpdateDTO) {
    try {
      await this.appointmentService.bulkRescheduleAppointments(bulkUpdate);
      return {
        status: 'success',
        message: 'Appointments updated successfully',
      };
    } catch (error) {
      Logger.error(error);
      return {
        status: 'error',
        message: `Appointments not updated: ${error}`,
      };
    }
  }
}
