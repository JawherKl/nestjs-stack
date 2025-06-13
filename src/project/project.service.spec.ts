import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { PaginationQueryDto } from '../dto/create-pagination.dto';
import { setupTestEnv } from '../../test/test-config';

describe('ProjectService', () => {
  let service: ProjectService;
  let prisma: PrismaService;

  const mockPrismaService = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        PrismaService,
        setupTestEnv(),
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const createDto: CreateProjectDto = {
      name: 'Test Project',
      description: 'Test Description',
    };
    const userId = 'test-user-id';

    it('should create a project successfully', async () => {
      const expectedProject = {
        id: 'test-id',
        ...createDto,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      mockPrismaService.project.create.mockResolvedValue(expectedProject);

      const result = await service.create(userId, createDto);
      expect(result).toEqual(expectedProject);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.create(userId, createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const paginationQuery: PaginationQueryDto = { page: 1, limit: 10 };

    it('should return paginated projects', async () => {
      const projects = [{ id: '1', name: 'Project 1' }];
      const total = 1;

      mockPrismaService.project.findMany.mockResolvedValue(projects);
      mockPrismaService.project.count.mockResolvedValue(total);

      const result = await service.findAll(paginationQuery);

      expect(result.items).toEqual(projects);
      expect(result.meta.total).toEqual(total);
    });
  });
});