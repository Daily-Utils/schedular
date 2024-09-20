import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, isString, IsString } from 'class-validator';
import { WeekDay } from '../timings.enum';

@InputType()
export class createTimingDto {
  @Field()
  @IsNumber()
  doctor_user_id: number;

  @Field()
  @IsEnum(WeekDay)
  day: WeekDay;

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
