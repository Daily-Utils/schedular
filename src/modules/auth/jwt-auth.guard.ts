import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  IS_CLOSED_FOR_USER,
  IS_OPEN_FOR_DEVELOPMENT,
  IS_PUBLIC_KEY,
} from './auth.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    const isOpenForDevelopment = this.reflector.get<boolean>(
      IS_OPEN_FOR_DEVELOPMENT,
      context.getHandler(),
    );

    const isClosedForUser = this.reflector.get<boolean>(
      IS_CLOSED_FOR_USER,
      context.getHandler(),
    );

    if (isOpenForDevelopment || isPublic) {
      return true;
    }

    if (isClosedForUser) {
      return false;
    }

    // Handle WebSocket subscription authentication
    const ctx = GqlExecutionContext.create(context).getContext();
    const { req, token } = ctx; // Extract req for HTTP, token for WS

    if (token) {
      // WebSocket context with JWT token from onConnect
      this.decodeAndPassJWTInRequest(token, ctx);
    } else if (req) {
      // HTTP request context
      this.decodeAndPassJWTInRequest(this.extractJwtFromRequest(req), req);
    } else {
      throw new UnauthorizedException('No authentication token provided');
    }

    return super.canActivate(new ExecutionContextHost([req || ctx]));
  }

  extractJwtFromRequest(request) {
    if (request.headers && request.headers.authorization) {
      return request.headers.authorization.split(' ')[1];
    }

    throw new UnauthorizedException('Authorization token not found');
  }

  decodeAndPassJWTInRequest(jwt: string, req: any) {
    const decodedJWT = this.jwtService.decode(jwt);
    req.user = decodedJWT;
  }
}
