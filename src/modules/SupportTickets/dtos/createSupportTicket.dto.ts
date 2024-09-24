import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { TicketStatus } from "../supporttickets.enum";


@InputType()
export class CreateSupportTicketDto {
  @Field()
  @IsNumber()
  patient_user_id: number;

  @Field()
  @IsString()
  message: string;

  @Field()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}