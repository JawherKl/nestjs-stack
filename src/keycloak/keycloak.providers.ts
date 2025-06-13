import { Provider } from '@nestjs/common';
import * as session from 'express-session';
import * as Keycloak from 'keycloak-connect';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": process.env.KEYCLOAK_REALM || 'realm-name',
  "auth-server-url": process.env.KEYCLOAK_AUTH_URL || 'http://localhost:8080/auth',
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_CLIENT_ID || 'client-id',
  "confidential-port": 0
});

export const KeycloakProvider: Provider = {
  provide: KEYCLOAK_INSTANCE,
  useValue: keycloak,
};
