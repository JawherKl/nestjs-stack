import { KeycloakConnectOptions, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

export const keycloakConfig: KeycloakConnectOptions = {

  authServerUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
  realm: process.env.KEYCLOAK_REALM || 'realm-name',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'client-id',
  secret: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret',
  policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
  tokenValidation: TokenValidation.ONLINE
};
