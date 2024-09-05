import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RollbarLogger } from 'nestjs-rollbar';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly rollbarLogger: RollbarLogger,
    ) { }

    catch(exception, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const url = request.originalUrl;

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            code: httpStatus,
            timestamp: new Date().toISOString(),
            message: exception?.message,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

        this.rollbarLogger.error(exception, 'unhandled-exception', { context: request });
    }
}
