import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { PaginationQueryDto } from '../dto/create-pagination.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

    async create(userId: string, createResourceDto: CreateResourceDto) {
    // Check if project exists and user owns it
    const project = await this.prisma.project.findFirst({
      where: { 
        id: createResourceDto.projectId,
        userId: userId,
        isArchived: false
      }
    });

    if (!project) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.prisma.resource.create({
      data: {
        name: createResourceDto.name,
        type: createResourceDto.type,
        value: createResourceDto.value,
        project: {
          connect: { id: createResourceDto.projectId }
        }
      },
      include: {
        project: true
      }
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      isArchived: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { type: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.resource.count({ where }),
      this.prisma.resource.findMany({
        where,
        skip,
        take: limit,
        include: {
          project: true
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
    const resource = await this.prisma.resource.findFirst({
      where: { 
        id,
        isArchived: false
      },
      include: {
        project: true
      }
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  async findByProject(projectId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      isArchived: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { type: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, items] = await Promise.all([
      this.prisma.resource.count({ where }),
      this.prisma.resource.findMany({
        where,
        skip,
        take: limit,
        include: {
          project: true
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

  async remove(id: string) {
    const resource = await this.findOne(id);
    
    return this.prisma.resource.update({
      where: { id },
      data: { isArchived: true }
    });
  }

  async restore(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return this.prisma.resource.update({
      where: { id },
      data: { isArchived: false }
    });
  }
}