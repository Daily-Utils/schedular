import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../roles.enum';
import { Category, Permission } from '../permission.enum';

@InputType()
export class RolePermissionVerificationInput {
  @Field()
  @IsEnum(Role)
  role_name: Role;

  @Field()
  @IsNotEmpty()
  @IsEnum(Permission)
  permission: Permission;

  @Field()
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
