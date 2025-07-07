import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService, PrismaService, ApiKeyGuard],
  exports: [ApiKeyService, ApiKeyGuard],
})
export class ApiKeyModule {}