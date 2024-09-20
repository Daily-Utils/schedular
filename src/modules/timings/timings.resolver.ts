import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TimingsService } from './timings.service';
import {
  getAllTimingsForADoctorOutputDTO,
  timingsOutputs,
} from './dtos/output.dto';
import { UpdateTimingDto } from './dtos/update_timing.dto';
import { createTimingDto } from './dtos/create_timing.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';

@Resolver()
export class TimingsResolver {
  constructor(
    @Inject(TimingsService)
    private readonly timingsService: TimingsService,
  ) {}

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [getAllTimingsForADoctorOutputDTO])
  async getTimingsForAllDoctor(@Args('doctor_id') doctor_user_id: number) {
    return this.timingsService.getAllTimingsForADoctor(doctor_user_id);
  }

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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
