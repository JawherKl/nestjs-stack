import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { KeycloakService } from '../keycloak/keycloak.service';


@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, KeycloakService],
})
export class UserModule {}
