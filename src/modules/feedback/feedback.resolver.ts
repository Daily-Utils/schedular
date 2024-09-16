import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { Feedback } from './feedbacks.entity';
import { CreateFeedbackInput } from './dto/feedback.dto';
import { FeedbackOutput } from './dto/feedbackoutput.dto';
import { OpenForDevelopment } from '../auth/auth.decorator';

@Resolver(() => FeedbackOutput)
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}
   
  @OpenForDevelopment()
  @Mutation(() => FeedbackOutput)
  async createFeedback(
    @Args('feedbackData') feedbackData: CreateFeedbackInput,
  ): Promise<Feedback> {
    // Call createFeedback with both patientId and feedbackData
    return this.feedbackService.createFeedback(feedbackData);
  }
}


