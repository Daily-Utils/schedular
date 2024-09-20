import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../roles.enum';

@InputType()
export class RoleInput {
  @Field()
  @IsEnum(Role)
  role_name: Role;
}

@ObjectType()
export class RoleOutput {
  @Field()
  roles_name: string;

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
