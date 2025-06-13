import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { KeycloakService } from './keycloak/keycloak.service';
import { ResourceService } from './resource/resource.service';
import { ResourceController } from './resource/resource.controller';
import { ResourceModule } from './resource/resource.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ProjectModule,
    AuthModule,
    PrismaModule,
    ResourceModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    KeycloakService
  ]
})
export class AppModule {}
