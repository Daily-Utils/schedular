import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { RollbarLogger } from 'nestjs-rollbar';
import { AllExceptionsFilter } from './exceptions/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const httpAdapter = app.get(HttpAdapterHost);
  const rollbarLogger = app.get(RollbarLogger);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));
  await app.listen(port);
  console.log(`App is running on port: ${port}`);
}
bootstrap();
