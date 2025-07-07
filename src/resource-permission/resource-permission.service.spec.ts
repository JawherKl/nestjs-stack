import { Test, TestingModule } from '@nestjs/testing';
import { ResourcePermissionService } from './resource-permission.service';

describe('ResourcePermissionService', () => {
  let service: ResourcePermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourcePermissionService],
    }).compile();

    service = module.get<ResourcePermissionService>(ResourcePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
