import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class searchDTO {
    @Field()
    @IsOptional()
    phone_number: string;

    @Field()
    @IsOptional()
    email: string;

    @Field()
    @IsOptional()
    username: string;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    speciality: [string];

    @Field(() => [String], { nullable: true })
    @IsOptional()
    services: [string];

    @Field()
    @IsOptional()
    facility_name: string;

    @Field()
    @IsOptional()
    facility_location: string;

    @Field()
    @IsOptional()
    facility_type: string;
  default_fee: any;
}
