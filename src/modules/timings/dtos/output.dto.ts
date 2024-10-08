import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class getAllTimingsForADoctorOutputDTO {
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
