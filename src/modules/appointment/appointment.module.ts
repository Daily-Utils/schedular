import { Module } from '@nestjs/common';
import { Appointment } from './appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentService } from './appointment.service';
import { DoctorModule } from '../doctor/doctor.module';
import { AppointmentCronService } from './appointmentcron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), DoctorModule],
  controllers: [],
  providers: [AppointmentService, AppointmentResolver, AppointmentCronService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
