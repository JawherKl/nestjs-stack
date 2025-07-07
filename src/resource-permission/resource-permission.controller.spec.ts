import { Test, TestingModule } from '@nestjs/testing';
import { ResourcePermissionController } from './resource-permission.controller';

describe('ResourcePermissionController', () => {
  let controller: ResourcePermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcePermissionController],
    }).compile();

    controller = module.get<ResourcePermissionController>(ResourcePermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
