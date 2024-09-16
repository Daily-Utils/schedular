import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';


@InputType()
export class CreateSupportTicketInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field({ nullable: true })
  @IsString()
  status?: string; 
  
  @Field()
  @IsNotEmpty()
  patient_id: number; 
}
