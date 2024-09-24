import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class PatientOutput {
  @Field()
  @IsNumber()
  readonly id: number;

  @Field()
  @IsString()
  readonly username: string;

  @Field()
  @IsNumber()
  readonly age: number;

  @Field()
  @IsString()
  readonly blood_group: string;

  @Field(() => [String])
  @IsArray()
  readonly health_issues: string[];

  @Field()
  @IsNumber()
  readonly weight: number;
}

@ObjectType()
export class responseForModificationDTOPaitent {
  @Field()
  @IsString()
  status: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
}
