import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";


@ObjectType()
export class ResponseDTO{
    @Field()
    @IsString()
    message: string;

    @Field()
    @IsString()
    status: string;
}