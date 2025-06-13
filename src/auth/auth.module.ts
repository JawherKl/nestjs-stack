import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { KeycloakService } from '../keycloak/keycloak.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    UserService,
    KeycloakService,
  ],
  exports: [JwtAuthGuard, RolesGuard]
})
export class AuthModule {}