// src\modules\auth\jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_CLOSED_FOR_USER, IS_OPEN_FOR_DEVELOPMENT, IS_PUBLIC_KEY } from './auth.decorator';
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

    if (isClosedForUser) {
      return false;
    }

    if (isPublic || isOpenForDevelopment) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext();
    const { req } = ctx;
    
    this.decodeAndPassJWTInRequest(this.extractJwtFromRequest(req), req);
    return super.canActivate(new ExecutionContextHost([req]));
  }

  extractJwtFromRequest(request) {
    return request?.headers?.authorization?.split(' ')[1];
  }

  decodeAndPassJWTInRequest(jwt: string, req: any) {
    const decodedJWT = this.jwtService.decode(jwt);
    req.user = decodedJWT;
  }
}
