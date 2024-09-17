import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getAllAppointmentsForDoctor(doctorId: number) {
    return await this.appointmentRepository.find({
      where: { doctor_user_id: doctorId },
    });
  }

  async getAllAppointmentsForPatient(patientId: number) {
    return await this.appointmentRepository.find({
      where: { patient_user_id: patientId },
    });
  }

  async createAppointment(appointment: createAppointmentDTO) {
    return await this.appointmentRepository.save(appointment);
  }

  async getAppointmentById(id: number) {
    return await this.appointmentRepository.findOne({ where: { id: id } });
  }

  async updateAppointment(updateAppointmentDTO: updateAppointmentDTO) {
    const updateData = Object.fromEntries(
      Object.entries(updateAppointmentDTO).filter(
        ([_, v]) => v !== undefined && v !== null,
      ),
    );

    delete updateData.id;

    return await this.appointmentRepository.update(
      updateAppointmentDTO.id,
      updateData,
    );
  }

  async deleteAppointment(id: number) {
    return await this.appointmentRepository.delete(id);
  }
}
