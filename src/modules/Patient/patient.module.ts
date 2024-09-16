import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]), // Register Patient repository
  ],
  exports: [TypeOrmModule], // Export it to make it available for other modules
})
export class PatientModule {}
