import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectPermissionService {
  constructor(private prisma: PrismaService) {}

  async shareProject(ownerId: string, projectId: string, userId: string, permission: 'read' | 'write' | 'admin') {
    return this.prisma.projectPermission.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: { permission },
      create: { userId, projectId, permission },
    });
  }

  async getProjectPermissions(projectId: string) {
    return this.prisma.projectPermission.findMany({
      where: { projectId },
      include: { user: true },
    });
  }

  async checkPermission(userId: string, projectId: string, required: 'read' | 'write' | 'admin') {
    const perm = await this.prisma.projectPermission.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });
    if (!perm) throw new ForbiddenException('No permission for this project');
    if (required === 'write' && perm.permission === 'read') throw new ForbiddenException('Write permission required');
    if (required === 'admin' && perm.permission !== 'admin') throw new ForbiddenException('Admin permission required');
    return true;
  }
}