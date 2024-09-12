// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './user.resolver';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../Patient/patient.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DoctorModule, PatientModule],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
