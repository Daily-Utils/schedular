// updateSupportDTO.ts

import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateSupportDTO {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  message?: string;

  @Field()
  @IsOptional()
  status?: 'open' | 'closed';

  @Field()
  @IsNumber()
  patient_user_id?: number;
}
