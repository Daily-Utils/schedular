// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'x&92Kv^Zc7b9@JN5Q', // Same secret key as used in JwtModule registration
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username }; // Customize as per your user entity
    }
}
