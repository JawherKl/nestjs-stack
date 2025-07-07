import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async logAction(params: {
    action: string;
    entity: string;
    entityId: string;
    userId: string;
    details?: any;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...params,
        details: params.details || {},
      },
    });
  }

  async getLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }
}