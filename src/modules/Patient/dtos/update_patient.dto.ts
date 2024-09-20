import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePatientDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly blood_group?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly weight: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  readonly relation?: string[];

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly family_member?: number[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  readonly health_issues?: string[];
}
