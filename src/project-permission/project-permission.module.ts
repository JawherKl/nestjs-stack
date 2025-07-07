import { Module } from '@nestjs/common';
import { ProjectPermissionService } from './project-permission.service';
import { ProjectPermissionController } from './project-permission.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProjectPermissionController],
  providers: [ProjectPermissionService, PrismaService],
  exports: [ProjectPermissionService],
})
export class ProjectPermissionModule {}