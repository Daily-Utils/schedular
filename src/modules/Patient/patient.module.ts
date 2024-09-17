
import { forwardRef, Module } from '@nestjs/common';
import { Patient } from './patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { UsersModule } from '../users/users.module';
import { PatientResolver } from './patient.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), forwardRef(() => UsersModule)],
  controllers: [],
  providers: [PatientService, PatientResolver],
  exports: [PatientService],
})
export class PatientModule {}
