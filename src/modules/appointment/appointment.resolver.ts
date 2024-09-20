import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { outputAppointment, outputForAppointment } from './dtos/output.dto';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';

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
        message: `Appointment not updated: ${error.message}`,
      };
    }
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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
        message: `Appointment not deleted: ${error.message}`,
      };
    }
  }
}
