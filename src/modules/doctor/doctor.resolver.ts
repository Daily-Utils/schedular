import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { OpenForDevelopment } from '../auth/auth.decorator';
import {
  DoctorResponseDto,
  responseForAllDoctorsFind,
  responseForAllDoctorsFindArray,
  responseForModificationDTO,
} from './dtos/output.dto';
import { UpdateDoctorDto } from './dtos/update_doctor.dto';
import { Logger } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { searchDTO, singleSearchResponse } from './dtos/search.dto';

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
    return await this.doctorService.getSingleDoctorById(id);
  }

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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

  @Roles([Role.Admin, Role.Doctor], {
    check_permission: false,
    permission_category: '',
    permission_type: '',
  })
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
}
