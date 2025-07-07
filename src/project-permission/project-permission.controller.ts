import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { ProjectPermissionService } from './project-permission.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects/:projectId/permissions')
@UseGuards(AuthGuard('jwt'))
export class ProjectPermissionController {
  constructor(private readonly service: ProjectPermissionService) {}

  @Post()
  @Roles('admin')
  async share(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() body: { userId: string; permission: 'read' | 'write' | 'admin' }
  ) {
    const ownerId = req.user?.sub;
    return this.service.shareProject(ownerId, projectId, body.userId, body.permission);
  }

  @Get()
  @Roles('admin')
  async getPermissions(@Param('projectId') projectId: string) {
    return this.service.getProjectPermissions(projectId);
  }
}