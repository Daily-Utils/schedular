import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly doctorService: DoctorService,
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
    const date_seleced = new Date(appointment.appointment_date_time).toISOString().split('T')[0];

    const availableSlots = await this.doctorService.getAvailableTimeSlotsForADoctor(
      appointment.doctor_user_id,
      date_seleced,
    );

    const isSlotAvailable = availableSlots.slots.find(
      (slot) =>
        slot === appointment.appointment_date_time.toTimeString().split(' ')[0],
    );

    if (!isSlotAvailable) {
      throw new Error('Slot not available');
    }

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

    const appointment = await this.appointmentRepository.findOne({
      where: { id: updateAppointmentDTO.id },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if(appointment.status === 'completed') {
      throw new Error('Appointment already completed');
    }
    
    if(updateData.appointment_date_time) {
      const date_selected = new Date(updateData.appointment_date_time).toISOString().split('T')[0];

      const availableSlots = await this.doctorService.getAvailableTimeSlotsForADoctor(
        appointment.doctor_user_id,
        date_selected,
      );

      const isSlotAvailable = availableSlots.slots.find(
        (slot) =>
          slot === updateData.appointment_date_time.toTimeString().split(' ')[0],
      );

      if (!isSlotAvailable) {
        throw new Error('Slot not available');
      }
    }

    return await this.appointmentRepository.update(
      updateAppointmentDTO.id,
      updateData,
    );
  }

  async deleteAppointment(id: number) {
    return await this.appointmentRepository.delete(id);
  }
}
