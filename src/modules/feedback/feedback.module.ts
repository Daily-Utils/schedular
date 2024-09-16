//import { forwardRef, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedbacks.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { Patient } from '../patient/patient.entity'; // Import the Patient entity
import { PatientModule } from '../patient/patient.module'; // Import the Patient module

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]), // Register Feedback repository
    PatientModule, // Import PatientModule
  ],
  providers: [FeedbackService, FeedbackResolver],
})
export class FeedbackModule {}


