import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TimingsService } from './timings.service';
import { OpenForDevelopment } from '../auth/auth.decorator';
import {
  getAllTimingsForADoctorOutputDTO,
  timingsOutputs,
} from './dtos/output.dto';
import { UpdateTimingDto } from './dtos/update_timing.dto';
import { createTimingDto } from './dtos/create_timing.dto';

@Resolver()
export class TimingsResolver {
  constructor(
    @Inject(TimingsService)
    private readonly timingsService: TimingsService,
  ) {}

  @OpenForDevelopment()
  @Query(() => [getAllTimingsForADoctorOutputDTO])
  async getTimingsForAllDoctor(@Args('doctor_id') doctor_user_id: number) {
    return this.timingsService.getAllTimingsForADoctor(doctor_user_id);
  }

  @OpenForDevelopment()
  @Mutation(() => timingsOutputs)
  async updateTimingDetails(
    @Args('doctor_id') doctor_id: number,
    @Args('day') day: string,
    @Args('updateTimingDetails') updateDTO: UpdateTimingDto,
  ) {
    try {
      await this.timingsService.modifyTimingDetails(doctor_id, day, updateDTO);
      return {
        status: 'success',
        message: 'Timing details updated successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'error',
        message: 'Error in updating timing details',
      };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => timingsOutputs)
  async deleteSingleTiming(
    @Args('doctor_id') doctor_id: number,
    @Args('day') day: string,
  ) {
    try {
      await this.timingsService.deleteSingleTiming(doctor_id, day);
      return {
        status: 'success',
        message: 'Timing deleted successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'error',
        message: 'Error in deleting timing',
      };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => timingsOutputs)
  async addTiming(@Args('createTimingDTO') createTimingDTO: createTimingDto) {
    try {
      await this.timingsService.addTimings(createTimingDTO);
      return {
        status: 'success',
        message: 'Timing added successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'error',
        message: 'Error in adding timing',
      };
    }
  }
}
