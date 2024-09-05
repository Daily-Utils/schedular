// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RollbarLogger } from 'nestjs-rollbar';
import { AllExceptionsFilter } from './exceptions/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const httpAdapter = app.get(HttpAdapterHost);

  const rollbarLogger = app.get(RollbarLogger);
  //app.useGlobalFilters(new GlobalRollbarExceptionFilter(rollbarLogger));

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));
  await app.listen(parseInt(app.get(ConfigService).get('port')));
}
bootstrap();
