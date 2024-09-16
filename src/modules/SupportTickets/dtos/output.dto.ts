// output.dto.ts

import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@ObjectType()
export class SupportOutputDTO{
    @Field()
    @IsString()
    status: string;

    @Field()
    @IsString()
    message: string;
}

@ObjectType()
export class supportTicketCreateOutputDTO{
    @Field()
    @IsNumber()
    id: number;

    @Field()
    @IsString()
    status: string;

    @Field()
    @IsString()
    message: string;

    @Field()
    @IsString()
    patient_user_id: number;
}