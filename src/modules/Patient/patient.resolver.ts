import { Inject, Logger } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { OpenForDevelopment } from '../auth/auth.decorator';
import { PatientService } from './patient.service';
import {
  PatientOutput,
  responseForModificationDTOPaitent,
} from './dtos/output.dto';
import { UpdatePatientDto } from './dtos/update_patient.dto';

@Resolver()
export class PatientResolver {
  constructor(
    @Inject(PatientService)
    private readonly patientService: PatientService,
  ) {}

  @OpenForDevelopment()
  @Query(() => [PatientOutput])
  async getAllPatientDetails() {
    return this.patientService.getAllPatients();
  }

  @OpenForDevelopment()
  @Query(() => PatientOutput)
  async getPatientByUserId(@Args('user_id') user_id: number) {
    return this.patientService.getPatientByUserId(user_id);
  }

  @OpenForDevelopment()
  @Mutation(() => responseForModificationDTOPaitent)
  async modifyPatientDetails(
    @Args('user_id') user_id: number,
    @Args('updatePatientDetails') updateDTO: UpdatePatientDto,
  ) {
    try {
      await this.patientService.modifyPatientDetails(user_id, updateDTO);
      return {
        status: 'success',
        message: 'Patient details updated successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'error',
        message: 'An error occurred while updating patient details',
      };
    }
  }

  @OpenForDevelopment()
  @Mutation(() => responseForModificationDTOPaitent)
  async deletePatient(@Args('user_id') user_id: number) {
    try {
      await this.patientService.deletePatient(user_id);
      return {
        status: 'success',
        message: 'Patient details deleted successfully',
      };
    } catch (e) {
      Logger.error(e);
      return {
        status: 'error',
        message: 'An error occurred while deleting patient details',
      };
    }
  }
}
