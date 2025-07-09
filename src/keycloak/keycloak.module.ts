import { Module } from '@nestjs/common';
import { KeycloakProvider } from './keycloak.providers';
import { KeycloakService } from './keycloak.service';

@Module({
  providers: [KeycloakProvider, KeycloakService],
  exports: [KeycloakProvider],
})
export class KeycloakCustomModule {}
