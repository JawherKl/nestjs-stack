import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PaginationQueryDto } from '../dto/create-pagination.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(userId: string, dto: CreateProjectDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        user: true
      }
    });

    await this.auditLogService.logAction({
      action: 'CREATE',
      entity: 'Project',
      entityId: project.id,
      userId,
      details: project,
    });

    return project;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      isArchived: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          resources: {
            where: { isArchived: false }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.project.findFirst({ 
      where: { 
        id,
        isArchived: false 
      } 
    });
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const updated = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    await this.auditLogService.logAction({
      action: 'UPDATE',
      entity: 'Project',
      entityId: id,
      userId,
      details: dto,
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const archived = await this.prisma.project.update({
      where: { id },
      data: { isArchived: true },
    });

    await this.auditLogService.logAction({
      action: 'ARCHIVE',
      entity: 'Project',
      entityId: id,
      userId,
      details: archived,
    });

    return archived;
  }

  async restore(id: string, userId: string) {
    const restored = await this.prisma.project.update({
      where: { id },
      data: { isArchived: false },
    });

    await this.auditLogService.logAction({
      action: 'RESTORE',
      entity: 'Project',
      entityId: id,
      userId,
      details: restored,
    });

    return restored;
  }

  async findArchived() {
    return this.prisma.project.findMany({
      where: { isArchived: true },
    });
  }
}
