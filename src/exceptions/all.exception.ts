import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { HttpAdapterHost } from '@nestjs/core';
import { RollbarLogger } from 'nestjs-rollbar';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly rollbarLogger: RollbarLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctxType = host.getType<'http' | 'graphql' | 'ws' | 'rpc'>();

    if (ctxType === 'http') {
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
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : exception,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

      this.rollbarLogger.error('unhandled-exception', {
        context: request,
      });
    } else if (ctxType === 'graphql') {
      const gqlContext = gqlHost.getContext();
      const request = gqlContext.req;

      console.log('GraphQL Request:', request);

      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const responseBody = {
        code: httpStatus,
        timestamp: new Date().toISOString(),
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : exception,
      };

      // Log the error to Rollbar
      this.rollbarLogger.error('unhandled-exception', {
        context: request,
      });

      // Throw the exception to be handled by the GraphQL layer
      throw exception;
    } else if (ctxType === 'ws') {
      // Handle WebSocket exceptions
      const wsContext = host.switchToWs();
      const client = wsContext.getClient();
      const data = wsContext.getData();

      // Log the error to Rollbar
      this.rollbarLogger.error('unhandled-exception', {
        context: { client, data },
      });

      // Optionally, you can send an error message to the WebSocket client
      client.send(
        JSON.stringify({
          event: 'error',
          data: {
            message:
              exception instanceof HttpException
                ? exception.getResponse()
                : exception,
          },
        }),
      );
    } else if (ctxType === 'rpc') {
      // Handle RPC exceptions
      const rpcContext = host.switchToRpc();
      const data = rpcContext.getData();

      // Log the error to Rollbar
      this.rollbarLogger.error('unhandled-exception', {
        context: data,
      });

      // Optionally, you can send an error response to the RPC client
      throw exception;
    }
  }
}
