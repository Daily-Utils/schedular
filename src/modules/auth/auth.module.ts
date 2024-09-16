// auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { PatientModule } from '../Patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PermissionsService } from './permission.service';
import { RolesModule } from '../roles/roles.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { PatientService } from '../Patient/patient.service';
import { SupportTicketModule } from '../SupportTickets/supporttickets.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'x&92Kv^Zc7b9@JN5Q',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PatientModule,
    DoctorModule,
    FeedbackModule,
    SupportTicketModule,
    forwardRef(() => RolesModule),
  ],
  controllers: [],
  providers: [
    AuthService,
    JwtStrategy,
    AuthResolver,
    PermissionsService,
    PatientService
  ],
  exports: [AuthService, PermissionsService],
})
export class AuthModule {}
