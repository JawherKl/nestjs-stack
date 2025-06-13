import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  // Clean up database before tests
  await prisma.$connect();
  await prisma.resource.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});