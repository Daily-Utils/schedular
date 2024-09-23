import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateTimingDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  to: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  from: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  break_from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  break_to?: string;
}
