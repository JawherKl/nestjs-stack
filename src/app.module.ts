import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { KeycloakService } from './keycloak/keycloak.service';
import { ResourceModule } from './resource/resource.module';
import { UserModule } from './user/user.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ProjectPermissionModule } from './project-permission/project-permission.module';
import { ResourcePermissionModule } from './resource-permission/resource-permission.module';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [
    ProjectModule,
    AuthModule,
    PrismaModule,
    ResourceModule,
    UserModule,
    AuditLogModule,
    ProjectPermissionModule,
    ResourcePermissionModule,
    ApiKeyModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    KeycloakService
  ]
})
export class AppModule {}
