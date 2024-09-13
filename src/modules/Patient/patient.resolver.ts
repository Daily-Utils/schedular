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
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';

@Resolver()
export class PatientResolver {
  constructor(
    @Inject(PatientService)
    private readonly patientService: PatientService,
  ) {}

  @Roles([Role.Admin], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => [PatientOutput])
  async getAllPatientDetails() {
    return this.patientService.getAllPatients();
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
  @Query(() => PatientOutput)
  async getPatientByUserId(@Args('user_id') user_id: number) {
    return this.patientService.getPatientByUserId(user_id);
  }

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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

  @Roles([Role.Admin, Role.Patient], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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
