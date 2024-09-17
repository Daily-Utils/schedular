import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from './feedbacks.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackInput, UpdateFeedbackInput } from './dto/feedback.dto';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let repository: Repository<Feedback>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    repository = module.get<Repository<Feedback>>(getRepositoryToken(Feedback));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeedback', () => {
    it('should create and save feedback', async () => {
      const feedbackData: CreateFeedbackInput = {
        // Add necessary properties here
        patient_user_id: 1,
        doctor_user_id: 1,
        consulting_feedback: 3,
        clinic_or_hospital_feedback: 4,
        waiting_time: 10,
      };
      const savedFeedback = { id: 1, ...feedbackData };

      jest.spyOn(repository, 'create').mockReturnValue(savedFeedback as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedFeedback as any);

      expect(await service.createFeedback(feedbackData)).toEqual(savedFeedback);
      expect(repository.create).toHaveBeenCalledWith(feedbackData);
      expect(repository.save).toHaveBeenCalledWith(savedFeedback);
    });
  });

  describe('getFeedbacksForAPaitent', () => {
    it('should retrieve all feedbacks for a given patient_user_id', async () => {
      const patient_user_id = 1;
      const feedbacks = [{ id: 1, patient_user_id }];

      jest.spyOn(repository, 'find').mockResolvedValue(feedbacks as any);

      expect(await service.getFeedbacksForAPaitent(patient_user_id)).toEqual(
        feedbacks,
      );
      expect(repository.find).toHaveBeenCalledWith({
        where: { patient_user_id },
      });
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback', async () => {
      const updateFeedbackDTO: UpdateFeedbackInput = {
        id: 1,
        consulting_feedback: 3,
        clinic_or_hospital_feedback: 4,
        waiting_time: 10,
        // Add necessary properties here
      };
      const updateResult = { affected: 1 };

      jest.spyOn(repository, 'update').mockResolvedValue(updateResult as any);

      expect(await service.updateFeedback(updateFeedbackDTO)).toEqual(
        updateResult,
      );
      expect(repository.update).toHaveBeenCalledWith(
        { id: updateFeedbackDTO.id },
        {
          consulting_feedback: updateFeedbackDTO.consulting_feedback,
          clinic_or_hospital_feedback:
            updateFeedbackDTO.clinic_or_hospital_feedback,
          waiting_time: updateFeedbackDTO.waiting_time,
        },
      );
    });
  });

  describe('deleteFeedback', () => {
    it('should delete feedback by ID', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult as any);

      expect(await service.deleteFeedback(id)).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
