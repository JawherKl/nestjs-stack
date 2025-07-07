import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { ResourcePermissionService } from './resource-permission.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('resources/:resourceId/permissions')
@UseGuards(AuthGuard('jwt'))
export class ResourcePermissionController {
  constructor(private readonly service: ResourcePermissionService) {}

  @Post()
  @Roles('admin')
  async share(
    @Req() req,
    @Param('resourceId') resourceId: string,
    @Body() body: { userId: string; permission: 'read' | 'write' | 'admin' }
  ) {
    const ownerId = req.user?.sub;
    return this.service.shareResource(ownerId, resourceId, body.userId, body.permission);
  }

  @Get()
  @Roles('admin')
  async getPermissions(@Param('resourceId') resourceId: string) {
    return this.service.getResourcePermissions(resourceId);
  }
}