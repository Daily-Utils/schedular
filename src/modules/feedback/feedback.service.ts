import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedbacks.entity';
import { CreateFeedbackInput, UpdateFeedbackInput } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async createFeedback(feedbackData: CreateFeedbackInput) {
    const feedback = this.feedbackRepository.create({
      ...feedbackData,
    });

    return this.feedbackRepository.save(feedback);
  }

  async getFeedbacksForAPaitent(patient_user_id: number) {
    return this.feedbackRepository.find({ where: { patient_user_id: patient_user_id } });
  }

  async updateFeedback(updateFeedbackDTO: UpdateFeedbackInput){
    return await this.feedbackRepository.update(
      { id: updateFeedbackDTO.id },
      {
        consulting_feedback: updateFeedbackDTO.consulting_feedback,
        clinic_or_hospital_feedback:
          updateFeedbackDTO.clinic_or_hospital_feedback,
        waiting_time: updateFeedbackDTO.waiting_time,
      },
    );
  }

  async deleteFeedback(id: number) {  
    return this.feedbackRepository.delete(id);
  }
}

