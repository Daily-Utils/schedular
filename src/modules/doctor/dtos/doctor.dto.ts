import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsNumber,
  ArrayNotEmpty,
} from 'class-validator';

@InputType()
export class CreateDoctorDto {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  services: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  speciality: string[];

  @Field()
  @IsNumber()
  @IsNotEmpty()
  default_fee: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  average_consulting_time: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  facility_name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  facility_type: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  facility_location: string;

  @Field()
  @IsNumber()
  user_id: number;
}
