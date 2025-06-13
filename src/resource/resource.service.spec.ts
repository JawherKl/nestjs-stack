import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { setupTestEnv } from '../../test/test-config';

describe('ResourceService', () => {
  let service: ResourceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    resource: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        PrismaService,
        setupTestEnv(),
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const createDto: CreateResourceDto = {
      name: 'API Key',
      type: 'API_KEY',
      value: 'secret-key',
      projectId: 'project-id',
    };
    const userId = 'user-id';

    it('should create a resource successfully', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue({
        id: createDto.projectId,
        userId,
      });

      const expectedResource = {
        id: 'resource-id',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.resource.create.mockResolvedValue(expectedResource);

      const result = await service.create(userId, createDto);
      expect(result).toEqual(expectedResource);
    });

    it('should throw ForbiddenException if user does not own project', async () => {
      mockPrismaService.project.findFirst.mockResolvedValue(null);
      await expect(service.create(userId, createDto)).rejects.toThrow(ForbiddenException);
    });
  });
});