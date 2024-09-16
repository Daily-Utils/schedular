import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedbacks.entity';
import { Patient } from '../Patient/patient.entity';
import { CreateFeedbackInput } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async createFeedback(feedbackData: CreateFeedbackInput) {
    // Log the patient_id to ensure it is being passed correctly
    console.log('Received patient_id:', feedbackData.patient_id);

    // Check if the patient exists
    const patient = await this.patientRepository.findOne({
      where: { id: feedbackData.patient_id },
    });

    // Log the result of the patient query
    console.log('Found patient:', patient);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create feedback with patient_id and feedback details
    const feedback = this.feedbackRepository.create({
      ...feedbackData,
    });

    return this.feedbackRepository.save(feedback);
  }
}

