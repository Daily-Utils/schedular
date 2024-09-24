import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateSupportTicketInput {
  @Field()
  @IsOptional()
  @IsString()
  status?: string;
}
