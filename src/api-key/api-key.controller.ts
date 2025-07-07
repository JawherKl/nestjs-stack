import { Controller, Post, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('projects/:projectId/api-keys')
  async generate(@Req() req, @Param('projectId') projectId: string) {
    const userId = req.user?.sub;
    return this.apiKeyService.generate(userId, projectId);
  }

  @Get('projects/:projectId/api-keys')
  async list(@Req() req, @Param('projectId') projectId: string) {
    const userId = req.user?.sub;
    return this.apiKeyService.list(userId, projectId);
  }

  @Delete('api-keys/:id')
  async revoke(@Req() req, @Param('id') id: string) {
    const userId = req.user?.sub;
    return this.apiKeyService.revoke(userId, id);
  }
}