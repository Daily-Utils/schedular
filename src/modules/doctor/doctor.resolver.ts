import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { OpenForDevelopment } from '../auth/auth.decorator';
import {
    DoctorResponseDto,
  responseForAllDoctorsFind,
  responseForModificationDTO,
} from './dtos/output.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';
import { Logger } from '@nestjs/common';

@Resolver()
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @OpenForDevelopment()
  @Query(() => responseForAllDoctorsFind)
  async findAllDoctors(@Context() context: any) {
    return this.doctorService.getDoctors();
  }

  @OpenForDevelopment()
  @Query(() => DoctorResponseDto)
  async findDoctorById(@Args('id') id: number, @Context() context: any) {
    return this.doctorService.getSingleDoctorById(id);
  }

  @OpenForDevelopment()
  @Mutation(() => responseForModificationDTO)
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

  @OpenForDevelopment()
  @Mutation(() => responseForModificationDTO)
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

  // TODO: Implement searchDoctors method
}
