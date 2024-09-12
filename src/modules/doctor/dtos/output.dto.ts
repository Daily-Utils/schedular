import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class responseForModificationDTO {
    @Field()
    @IsNumber()
    status: string;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    message: string;
}

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
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  services: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  speciality: string;

  @Field()
  @IsNumber()
  default_fee: number;

  @Field()
  @IsNumber()
  average_consulting_time: number;

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

  @Field(() => [TimingDto])
  @IsArray()
  timings: TimingDto[];
}