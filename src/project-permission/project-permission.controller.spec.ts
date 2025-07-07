import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPermissionController } from './project-permission.controller';

describe('ProjectPermissionController', () => {
  let controller: ProjectPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectPermissionController],
    }).compile();

    controller = module.get<ProjectPermissionController>(ProjectPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
