import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { Feedback } from './feedbacks.entity';
import { CreateFeedbackInput, UpdateFeedbackInput } from './dto/feedback.dto';
import { FeedbackCreateOutput } from './dto/feedbackoutput.dto';
import { Logger } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { ResponseDTO } from '../dtos/response.dto';

@Resolver()
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [FeedbackCreateOutput])
  async getFeedbacksForAPaitent(
    @Args('patient_user_id') patient_user_id: number,
  ) {
    return this.feedbackService.getFeedbacksForAPaitent(patient_user_id);
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => FeedbackCreateOutput)
  async createFeedback(
    @Args('feedbackData') feedbackData: CreateFeedbackInput,
  ): Promise<Feedback> {
    return this.feedbackService.createFeedback(feedbackData);
  }

  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
  async deleteFeedback(@Args('id') id: number) {
    try {
      await this.feedbackService.deleteFeedback(id);
      return {
        status: 'Success',
        message: 'Feedback deleted successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'Failure',
        message: 'Failed to delete feedback',
      };
    }
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
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


