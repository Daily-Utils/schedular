import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, isString, IsString } from 'class-validator';

@InputType()
export class createTimingDto {
  @Field()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsString()
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

  @Field()
  @IsString()
  from: string;

  @Field()
  @IsString()
  to: string;

  @Field()
  @IsString()
  break_from: string;

  @Field()
  @IsOptional()
  @IsString()
  break_to: string;
}
