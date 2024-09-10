import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RolePermissionVerificationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  role_name: 'admin' | 'patient' | 'guest';

  @Field()
  @IsNotEmpty()
  @IsString()
  permission: 'create' | 'read' | 'update' | 'delete';

  @Field()
  @IsNotEmpty()
  @IsString()
  category:
    | 'appointment_permission'
    | 'feedback_permission'
    | 'support_tickets_permissions';
}
