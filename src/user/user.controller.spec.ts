import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KeycloakService } from '../keycloak/keycloak.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockKeycloakService = {
    createUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: KeycloakService,
          useValue: mockKeycloakService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});