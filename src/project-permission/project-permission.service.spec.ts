import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPermissionService } from './project-permission.service';

describe('ProjectPermissionService', () => {
  let service: ProjectPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectPermissionService],
    }).compile();

    service = module.get<ProjectPermissionService>(ProjectPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
