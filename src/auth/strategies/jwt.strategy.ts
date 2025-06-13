import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 100,
        jwksUri: `${process.env.KEYCLOAK_URL}/realms/devhive/protocol/openid-connect/certs`,
      }),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub, // Using 'sub' claim which contains Keycloak user ID
      email: payload.email,
      roles: payload.realm_access?.roles || []
    };
  }
}