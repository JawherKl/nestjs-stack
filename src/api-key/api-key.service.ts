import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async generate(userId: string, projectId: string) {
    const key = randomBytes(32).toString('hex');
    return this.prisma.apiKey.create({
      data: { key, userId, projectId },
    });
  }

  async list(userId: string, projectId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId, projectId },
      select: { id: true, key: true, createdAt: true, revoked: true },
    });
  }

  async revoke(userId: string, apiKeyId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { id: apiKeyId } });
    if (!apiKey) throw new NotFoundException('API key not found');
    if (apiKey.userId !== userId) throw new ForbiddenException('Not your API key');
    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { revoked: true },
    });
  }

  async validate(key: string) {
    return this.prisma.apiKey.findFirst({
      where: { key, revoked: false },
      include: { user: true, project: true },
    });
  }
}