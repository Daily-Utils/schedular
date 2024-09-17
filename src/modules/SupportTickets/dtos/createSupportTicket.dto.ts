import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";


@InputType()
export class CreateSupportTicketDto {
    @Field()
    @IsNumber()
    patient_user_id: number;
    
    @Field()
    @IsString()
    message: string;
    
    @Field()
    @IsString()
    status: string;
}