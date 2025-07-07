import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcePermissionService {
  constructor(private prisma: PrismaService) {}

  async shareResource(ownerId: string, resourceId: string, userId: string, permission: 'read' | 'write' | 'admin') {
    return this.prisma.resourcePermission.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      update: { permission },
      create: { userId, resourceId, permission },
    });
  }

  async getResourcePermissions(resourceId: string) {
    return this.prisma.resourcePermission.findMany({
      where: { resourceId },
      include: { user: true },
    });
  }

  async checkPermission(userId: string, resourceId: string, required: 'read' | 'write' | 'admin') {
    const perm = await this.prisma.resourcePermission.findUnique({
      where: { userId_resourceId: { userId, resourceId } }
    });
    if (!perm) throw new ForbiddenException('No permission for this resource');
    if (required === 'write' && perm.permission === 'read') throw new ForbiddenException('Write permission required');
    if (required === 'admin' && perm.permission !== 'admin') throw new ForbiddenException('Admin permission required');
    return true;
  }
}