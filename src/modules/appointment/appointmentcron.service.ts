import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { Repository } from "typeorm";
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppointmentCronService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  @OnEvent('cron.job.update.two.hrs.ahead.appointment')
  async handleCronJobForTwoHrsAheadAppointment(payload: [Appointment]) {
    const appointmentIds = payload.map((appointment) => appointment.id);

    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: 'reschedule_needed' })
      .whereInIds(appointmentIds)
      .execute();
  }

  @OnEvent('cron.job.update.five.minutes.below.ongoing.appointment')
  async handleCronJobForFiveMinsAheadAppointments(payload: [Appointment]) {
    const appointmentIds = payload.map((appointment) => appointment.id);

    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: 'on-hold' })
      .whereInIds(appointmentIds)
      .execute();
  }

  @OnEvent('cron.job.update.two.hrs.ahead.ongoing.appointment')
  async handleCronForTwoHrsAheadOnGoingAppointment(payload: [Appointment]) {
    const appointmentIds = payload.map((appointment) => appointment.id);

    await this.appointmentRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: 'completed' })
      .whereInIds(appointmentIds)
      .execute();
  }
}