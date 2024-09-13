import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";


@ObjectType()
export class getAllTimingsForADoctorOutputDTO{
    @Field()
    id: number;

    @Field()
    day: string;

    @Field()
    from: string;

    @Field()
    to: string;

    @Field()
    break_from: string;

    @Field()
    break_to: string;
}

@ObjectType()
export class timingsOutputs {
  @Field()
  @IsString()
  status: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
} 