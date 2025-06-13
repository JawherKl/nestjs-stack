// src/keycloak/keycloak.module.ts
import { Module } from '@nestjs/common';
import { KeycloakProvider } from './keycloak.providers';

@Module({
  providers: [KeycloakProvider],
  exports: [KeycloakProvider],
})
export class KeycloakCustomModule {}
