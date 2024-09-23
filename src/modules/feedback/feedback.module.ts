//import { forwardRef, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedbacks.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  providers: [FeedbackService, FeedbackResolver],
})
export class FeedbackModule {}
