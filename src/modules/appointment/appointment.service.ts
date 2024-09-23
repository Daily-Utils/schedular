import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  bulkUpdateDTO,
  createAppointmentDTO,
  updateAppointmentDTO,
} from './dtos/appointment.dto';
import { DoctorService } from '../doctor/doctor.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as cron from 'node-cron';
import { Between } from 'typeorm';

@Injectable()
export class AppointmentService {
  minsForCron = '5';

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

    cron.schedule(`${this.minsForCron} * * * *`, async () => {
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
      const fifteenMinAhead = new Date(currentDate.getTime() + 15 * 60 * 1000);

      const inprogressAppointment = twoHoursAheadAppointment.filter(
        (appointment) => appointment.status === 'on-going',
      );

      const fiveMinsBelowAppointment: Appointment[] = [];
      const fiveToFifteenAppointment: Appointment[] = [];

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
          } else if (
            appointment.appointment_date_time > fiveMinAhead &&
            appointment.appointment_date_time <= fifteenMinAhead &&
            appointment.status === 'on-hold'
          ) {
            addToOthers = false;
            fiveToFifteenAppointment.push(appointment);
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

      this.eventEmitter.emit(
        'cron.job.update.five.to.fifteen.minutes.below.ongoing.appointment',
        fiveToFifteenAppointment,
      );
    });
  }

  stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  checkIfAppointmentIsInPast(appointment_date: Date) {
    const current_date = this.stripTime(new Date());
    const appointment_day = this.stripTime(appointment_date);
    return appointment_day < current_date;
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

  async checkWhetherPatientHasAppointmentForTheDay(
    appointment_date_time: Date,
    patientId: number,
  ) {
    const startOfDay = new Date(
      appointment_date_time.getFullYear(),
      appointment_date_time.getMonth(),
      appointment_date_time.getDate(),
    );

    // Calculate the end of the day
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    // Get appointments for the day
    const exist_appointment = await this.appointmentRepository.find({
      where: {
        appointment_date_time: Between(startOfDay, endOfDay),
      },
    });

    // check if patient_user_id already has an appointment
    const patient_appointment = exist_appointment.find(
      (app) => app.patient_user_id === patientId,
    );

    if (patient_appointment) {
      return true;
    }

    return false;
  }

  async createAppointment(appointment: createAppointmentDTO) {
    if (this.checkIfAppointmentIsInPast(appointment.appointment_date_time)) {
      throw new Error('Cannot schedule appointments in past');
    }

    // get appointments for day
    if (
      await this.checkWhetherPatientHasAppointmentForTheDay(
        appointment.appointment_date_time,
        appointment.patient_user_id,
      )
    ) {
      throw new Error('Patient already has an appointment for the day');
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      const appointment = await this.appointmentRepository.findOne({
        where: { id: updateAppointmentDTO.id },
      });

      if (
        await this.checkWhetherPatientHasAppointmentForTheDay(
          updateData.appointment_date_time,
          appointment.patient_user_id,
        )
      ) {
        throw new Error('Patient already has an appointment for the day');
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

  async bulkRescheduleAppointments(updateData: bulkUpdateDTO) {
    if (updateData.appointment_ids.length === 0) {
      throw new Error('No appointments to reschedule');
    }

    // create a timeline from and to parameters
    const from = new Date(updateData.from);
    const to = new Date(updateData.to);

    // check whether this is not 15 days
    if (from.getTime() - to.getTime() > 15 * 24 * 60 * 60 * 1000) {
      throw new Error(
        'Cannot bulk reschedule appointments for more than 15 days',
      );
    }

    let current = new Date(from);
    let currentIdx = 0;
    while (current <= to && currentIdx <= updateData.appointment_ids.length) {
      const date_selected = current.toISOString().split('T')[0];

      const appointmentId = updateData.appointment_ids[currentIdx];
      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId },
      });

      const appointments = await this.appointmentRepository.find({
        where: {
          doctor_user_id: updateData.doctor_user_id,
          patient_user_id: appointment.patient_user_id,
          appointment_date_time: Between(
            new Date(date_selected),
            new Date(date_selected + 'T23:59:59'),
          ),
        },
      });

      if (appointments.length > 0) {
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        continue;
      }

      const availableSlots =
        await this.doctorService.getAvailableTimeSlotsForADoctor(
          updateData.doctor_user_id,
          date_selected,
        );

      if (availableSlots.slots.length === 0) {
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        continue;
      }

      for (let i = 0; i < availableSlots.slots.length; i++) {
        if (currentIdx <= updateData.appointment_ids.length) {
          await this.appointmentRepository.update(
            updateData.appointment_ids[currentIdx],
            {
              appointment_date_time: new Date(
                availableSlots.actualTimings[currentIdx],
              ),
            },
          );
          currentIdx++;
        }
      }

      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }

    return;
  }

  async deleteAppointment(id: number) {
    return await this.appointmentRepository.delete(id);
  }
}
