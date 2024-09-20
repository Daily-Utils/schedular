import { Field, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";


@ObjectType()
export class response{
    @Field()
    @IsString()
    message: string;

    @Field()
    @IsString()
    status: string;
}