import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class searchDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  speciality?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  services?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facility_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facility_location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  facility_type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  default_fee?: number;
}


@ObjectType()
export class singleSearchResponse{
    @Field()
    id: number;

    @Field()
    username: string;

    @Field(() => [String])
    services: string[];

    @Field(() => [String])
    speciality: string[];

    @Field()
    average_consulting_time: string;

    @Field()
    facility_name: string;

    @Field()
    facility_type: string;

    @Field()
    facility_location: string;

    @Field()
    default_fee: number;
}