/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { OpenForDevelopment } from '../auth/auth.decorator';
import {
  DoctorAvailableSlots,
  DoctorResponseDto,
  responseForAllDoctorsFindArray,
} from './dtos/output.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';
import { Logger } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { searchDTO, singleSearchResponse } from './dtos/search.dto';
import { ResponseDTO } from '../dtos/response.dto';

@Resolver()
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => responseForAllDoctorsFindArray)
  async findAllDoctors(@Context() context: any) {
    return await this.doctorService.getDoctors();
  }

  @Roles([Role.Admin, Role.Patient, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => DoctorResponseDto)
  async findDoctorById(@Args('id') id: number, @Context() context: any) {
    const doctors = await this.doctorService.getSingleDoctorById(id);
    return doctors;
  }

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
  async modifyDoctorById(
    @Args('id') id: number,
    @Args('updateDoctorDto') updateDoctorDto: UpdateDoctorDto,
    @Context() context: any,
  ) {
    try {
      await this.doctorService.updateDoctorById(id, updateDoctorDto);

      return {
        status: 'success',
        message: 'Doctor updated successfully',
      };
    } catch (error) {
      Logger.error(error);

      return {
        status: 'failure',
        message: 'Doctor not updated successfully',
      };
    }
  }

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Mutation(() => ResponseDTO)
  async deleteDoctorById(@Args('id') id: number, @Context() context: any) {
    try {
      await this.doctorService.deleteDoctorById(id);

      return {
        status: 'success',
        message: 'Doctor deleted successfully',
      };
    } catch (error) {
      Logger.error(error);

      return {
        status: 'failure',
        message: 'Doctor not deleted successfully',
      };
    }
  }

  @Roles([Role.Admin, Role.Doctor, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [singleSearchResponse])
  async searchDoctor(
    @Args('searchTerm') searchDTO: searchDTO,
    @Context() context: any,
  ) {
    return await this.doctorService.searchDoctors(searchDTO);
  }

  @Roles([Role.Admin, Role.Doctor, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => DoctorAvailableSlots)
  async getAvaliableSlotsForAppointmentsWithADoctor(
    @Args('doctorId') doctorId: number,
    @Args('date') date: string,
  ) {
    return await this.doctorService.getAvailableTimeSlotsForADoctor(
      doctorId,
      date,
    );
  }
}
