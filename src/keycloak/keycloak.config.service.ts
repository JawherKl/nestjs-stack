import { Injectable, Logger } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
    private readonly keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
    private readonly realm = process.env.KEYCLOAK_REALM || 'realm-name';
    private readonly clientId = process.env.KEYCLOAK_CLIENT_ID || 'client-id';
    private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret';
  
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.keycloakUrl,
      realm: this.realm,
      clientId: this.clientId,
      secret: this.clientSecret,
      useNestLogger: false,
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}
