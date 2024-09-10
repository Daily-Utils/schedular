import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserGraphQL {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;
}