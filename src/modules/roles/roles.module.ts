import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Roles]), forwardRef(() => AuthModule)],
  controllers: [],
  providers: [RolesService, RolesResolver, RolesGuard],
  exports: [RolesService, RolesGuard],
})
export class RolesModule {}
