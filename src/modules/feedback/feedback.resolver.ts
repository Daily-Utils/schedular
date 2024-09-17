import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { Feedback } from './feedbacks.entity';
import { CreateFeedbackInput, UpdateFeedbackInput } from './dto/feedback.dto';
import { FeedbackCreateOutput, FeedbackUpdateDeleteOutput } from './dto/feedbackoutput.dto';
import { OpenForDevelopment } from '../auth/auth.decorator';
import { Logger } from '@nestjs/common';

@Resolver()
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @OpenForDevelopment()
  @Query(() => [FeedbackCreateOutput])
  async getFeedbacksForAPaitent(
    @Args('patient_user_id') patient_user_id: number,
  ) {
    return this.feedbackService.getFeedbacksForAPaitent(patient_user_id);
  }

  @OpenForDevelopment()
  @Mutation(() => FeedbackCreateOutput)
  async createFeedback(
    @Args('feedbackData') feedbackData: CreateFeedbackInput,
  ): Promise<Feedback> {
    return this.feedbackService.createFeedback(feedbackData);
  }

  @OpenForDevelopment()
  @Mutation(() => FeedbackUpdateDeleteOutput)
  async deleteFeedback(@Args('id') id: number) {
    try{
      await this.feedbackService.deleteFeedback(id);
      return {
        status: 'Success',
        message: 'Feedback deleted successfully',
      };
    }catch(e){
        Logger.error(e);
        return {
          status: 'Failure',
          message: 'Failed to delete feedback'
        };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => FeedbackUpdateDeleteOutput)
  async updateFeedback(
    @Args('feedbackUpdateData') feedbackData: UpdateFeedbackInput,
  ) {
    try {
      await this.feedbackService.updateFeedback(feedbackData);
      return {
        status: 'Success',
        message: 'Feedback updated successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'Failure',
        message: 'Failed to update feedback',
      };
    }
  }
}


