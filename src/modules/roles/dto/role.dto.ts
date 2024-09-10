import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RoleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  role_name: 'admin' | 'patient' | 'guest';
}

@ObjectType()
export class RoleOutput {
  @Field()
  roles_name: 'admin' | 'patient' | 'guest';

  @Field(() => [String])
  appointment_permission: string[];

  @Field(() => [String])
  feedback_permission: string[];

  @Field(() => [String])
  support_tickets_permissions: string[];
}

@ObjectType()
export class RoleOutputForModification {
  @Field()
  status: number;

  @Field()
  message: string;
}
