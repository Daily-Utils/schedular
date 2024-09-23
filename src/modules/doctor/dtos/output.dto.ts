import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class responseForAllDoctorsFind {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;
}

@ObjectType()
export class responseForAllDoctorsFindArray {
  @Field(() => [responseForAllDoctorsFind])
  @IsArray()
  doctors: responseForAllDoctorsFind[];
}

@ObjectType()
export class TimingDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  day: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  to: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  from: string;
}

@ObjectType()
export class DoctorResponseDto {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  username: string;

  @Field(() => [String])
  @IsArray()
  services: string[];

  @Field(() => [String])
  @IsArray()
  speciality: string[];

  @Field()
  @IsNumber()
  experience: number;

  @Field()
  @IsNumber()
  default_fee: number;

  @Field()
  @IsString()
  average_consulting_time: string;

  @Field()
  @IsString()
  facility_name: string;

  @Field()
  @IsString()
  facility_type: string;

  @Field()
  @IsString()
  facility_location: string;

  @Field(() => [TimingDto])
  @IsArray()
  timings: TimingDto[];
}

@ObjectType()
export class DoctorAvailableSlots {
  @Field(() => [String])
  @IsArray()
  slots: string[];

  @Field(() => [String])
  @IsArray()
  actualTimings: string[];
}
