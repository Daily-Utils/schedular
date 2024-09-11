import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { RollbarLogger } from 'nestjs-rollbar';
import { AllExceptionsFilter } from './exceptions/all.exception';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PermissionsService } from './modules/auth/permission.service';
import { RolesGuard } from './modules/roles/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const httpAdapter = app.get(HttpAdapterHost);
  const rollbarLogger = app.get(RollbarLogger);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const permissionsService = app.get(PermissionsService);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));
  app.useGlobalGuards(new RolesGuard(reflector, permissionsService));
  await app.listen(port);
  Logger.log(`App is running on port: ${port}`);
}
bootstrap();
