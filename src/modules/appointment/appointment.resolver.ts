import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { OpenForDevelopment } from '../auth/auth.decorator';
import { outputAppointment, outputForAppointment } from './dtos/output.dto';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';

@Resolver()
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @OpenForDevelopment()
  @Query(() => [outputAppointment])
  async getAppointmentsForDoctor(
    @Args('doctor_user_id') doctor_user_id: number,
  ) {
    return await this.appointmentService.getAllAppointmentsForDoctor(
      doctor_user_id,
    );
  }

  @OpenForDevelopment()
  @Query(() => [outputAppointment])
  async getAppointmentsForPatients(
    @Args('patient_user_id') patient_user_id: number,
  ) {
    return await this.appointmentService.getAllAppointmentsForPatient(
      patient_user_id,
    );
  }

  @OpenForDevelopment()
  @Mutation(() => outputAppointment)
  async createAppointment(
    @Args('appointment') appointment: createAppointmentDTO,
  ) {
    return await this.appointmentService.createAppointment(appointment);
  }

  @OpenForDevelopment()
  @Mutation(() => outputAppointment)
  async getAppointmentById(@Args('id') id: number) {
    return await this.appointmentService.getAppointmentById(id);
  }

  @OpenForDevelopment()
  @Mutation(() => outputForAppointment)
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
        message: 'Appointment not updated',
      };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => outputForAppointment)
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
        message: 'Appointment not deleted',
      };
    }
  }
}
