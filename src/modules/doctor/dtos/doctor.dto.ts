import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateDoctorDto {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  speciality: string[];

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsNotEmpty()
  experience?: number;

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
