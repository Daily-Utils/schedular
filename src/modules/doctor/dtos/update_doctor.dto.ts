import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDoctorDto } from './doctor.dto';

@InputType()
export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
