import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';
import { DoctorService } from '../doctor/doctor.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as cron from 'node-cron';

@Injectable()
export class AppointmentService {
  minsForCron = '1';

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly doctorService: DoctorService,

    private eventEmitter: EventEmitter2,
  ) {
    this.scheduleTableCleanUp();
  }

  async scheduleTableCleanUp() {
    const limit = 10;
    const currentDate = new Date();

    cron.schedule(`* * * * *`, async () => {
      const twoHoursAhead = new Date(
        currentDate.getTime() + 2 * 60 * 60 * 1000,
      );

      const statuses = ['scheduled', 'rescheduled', 'on-hold', 'on-going'];

      const twoHoursAheadAppointment = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.appointment_date_time <= :twoHoursAhead', {
          twoHoursAhead,
        })
        .andWhere('appointment.status IN (:...statuses)', { statuses })
        .limit(limit)
        .getMany();

      const newStatusForOnHold = ['scheduled', 'rescheduled'];

      const fiveMinAhead = new Date(currentDate.getTime() + 5 * 60 * 1000);

      const inprogressAppointment = twoHoursAheadAppointment.filter(
        (appointment) => appointment.status === 'on-going',
      );
      
      const fiveMinsBelowAppointment: Appointment[] = [];

      const otherAppointments = twoHoursAheadAppointment.filter(
        (appointment) => {
          let addToOthers = true;

          if (
            currentDate <= appointment.appointment_date_time && 
            appointment.appointment_date_time <= fiveMinAhead &&
            newStatusForOnHold.includes(appointment.status)
          ) {
            addToOthers = false;
            fiveMinsBelowAppointment.push(appointment);
          }

          return appointment.status !== 'on-going' && addToOthers;
        },
      );

      this.eventEmitter.emit(
        'cron.job.update.two.hrs.ahead.appointment',
        otherAppointments,
      );

      this.eventEmitter.emit(
        'cron.job.update.two.hrs.ahead.ongoing.appointment',
        inprogressAppointment,
      );

      this.eventEmitter.emit(
        'cron.job.update.five.minutes.below.ongoing.appointment',
        fiveMinsBelowAppointment,
      );
    });
  }

  checkIfAppointmentIsInPast(appointment_date: Date) {
    const current_date = new Date();
    return appointment_date < current_date;
  }

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
    if (this.checkIfAppointmentIsInPast(appointment.appointment_date_time)) {
      throw new Error('Cannot schedule appointments in past');
    }

    const date_seleced = new Date(appointment.appointment_date_time)
      .toISOString()
      .split('T')[0];

    const availableSlots =
      await this.doctorService.getAvailableTimeSlotsForADoctor(
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

    if (appointment.status === 'completed') {
      throw new Error('Appointment already completed');
    }

    if (updateData.appointment_date_time) {
      if (this.checkIfAppointmentIsInPast(updateData.appointment_date_time)) {
        throw new Error('Cannot schedule appointments in past');
      }

      const date_selected = new Date(updateData.appointment_date_time)
        .toISOString()
        .split('T')[0];

      const availableSlots =
        await this.doctorService.getAvailableTimeSlotsForADoctor(
          appointment.doctor_user_id,
          date_selected,
        );

      const isSlotAvailable = availableSlots.slots.find(
        (slot) =>
          slot ===
          updateData.appointment_date_time.toTimeString().split(' ')[0],
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
