import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';
import { LoggerModule } from 'nestjs-rollbar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { GraphqlModule } from './graphql/graphql.module';
import { RolesModule } from './modules/roles/roles.module';
import { PatientModule } from './modules/Patient/patient.module';
import { TimingModule } from './modules/timings/timings.module';
import { SupportTicketsModule } from './modules/SupportTickets/supporttickets.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ChatModule } from './modules/Chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accessToken: configService.get('rollbar.accessToken'),
        environment: configService.get('rollbar.environment'),
        captureUncaught: true,
        captureUnhandledRejections: true,
        ignoreDuplicateErrors: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    GraphqlModule,
    RolesModule,
    PatientModule,
    TimingModule,
    SupportTicketsModule,
    FeedbackModule,
    AppointmentModule,
    ChatModule,
    JwtModule.register({
      secret: 'x&92Kv^Zc7b9@JN5Q',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
