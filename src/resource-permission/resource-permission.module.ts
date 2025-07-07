import { Module } from '@nestjs/common';
import { ResourcePermissionService } from './resource-permission.service';
import { ResourcePermissionController } from './resource-permission.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ResourcePermissionController],
  providers: [ResourcePermissionService, PrismaService],
  exports: [ResourcePermissionService],
})
export class ResourcePermissionModule {}