import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { KeycloakService } from './keycloak/keycloak.service';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let keycloak: KeycloakService;
  let jwtToken: string;
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    prisma = app.get<PrismaService>(PrismaService);
    keycloak = app.get<KeycloakService>(KeycloakService);
    
    await app.init();

    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
    userId = user.id;

    // Mock Keycloak login
    const loginResponse = await keycloak.login('test@example.com', 'password123');
    jwtToken = loginResponse.access_token;
  });

  /*afterAll(async () => {
    await cleanupDatabase();
    await app.close();
  });*/

  /*beforeEach(async () => {
    await cleanupDatabase();
  });*/

  const cleanupDatabase = async () => {
    await prisma.resource.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  };

  describe('Auth', () => {
    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('john.doe@example.com');
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
        });
    });
  });

  describe('Projects', () => {
    beforeEach(async () => {
      // Create a test project
      const project = await prisma.project.create({
        data: {
          name: 'Test Project',
          description: 'Test Description',
          userId,
        },
      });
      projectId = project.id;
    });

    it('/projects (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/projects')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.items)).toBeTruthy();
          expect(res.body.meta).toBeDefined();
        });
    });

    it('/projects (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'New Project',
          description: 'New Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('New Project');
        });
    });

    it('/projects/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(projectId);
          expect(res.body.name).toBe('Test Project');
        });
    });

    it('/projects/:id (PUT)', () => {
      return request(app.getHttpServer())
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'Updated Project',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Project');
        });
    });

    it('/projects/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('Resources', () => {
    let resourceId: string;

    beforeEach(async () => {
      // Create a test resource
      const resource = await prisma.resource.create({
        data: {
          name: 'Test Resource',
          type: 'API_KEY',
          value: 'test-value',
          projectId,
        },
      });
      resourceId = resource.id;
    });

    it('/resources (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/resources')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.items)).toBeTruthy();
          expect(res.body.meta).toBeDefined();
        });
    });

    it('/resources (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'New Resource',
          type: 'API_KEY',
          value: 'new-value',
          projectId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('New Resource');
        });
    });

    it('/resources/:id (GET)', () => {
      return request(app.getHttpServer())
        .get(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(resourceId);
          expect(res.body.name).toBe('Test Resource');
        });
    });

    it('/resources/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete(`/api/resources/${resourceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});