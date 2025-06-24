import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from '../dto/create-pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('resources')
@ApiBearerAuth()
@Controller('resources')
@UseGuards(AuthGuard('jwt'))
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({ status: 201, description: 'Resource successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Req() req: Request, @Body() createResourceDto: CreateResourceDto) {
    const userId = req.user?.['userId'];
    return this.resourceService.create(userId, createResourceDto);
  }

  @Get()
  @Roles('user')
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({ status: 200, description: 'Return all resources.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number'
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.resourceService.findAll(query);
  }

  @Get(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiResponse({ status: 200, description: 'Return resource by ID.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' }) 
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Get('project/:projectId')
  @Roles('user')
  @ApiOperation({ summary: 'Get resources by project ID' })
  @ApiResponse({ status: 200, description: 'Return resources for the specified project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })  
  findByProject(
    @Param('projectId') projectId: string,
    @Query() query: PaginationQueryDto
  ) {
    return this.resourceService.findByProject(projectId, query);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a resource by ID' })
  @ApiResponse({ status: 204, description: 'Resource successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }

  @Post(':id/restore')
  @Roles('admin')
  @ApiOperation({ summary: 'Restore a deleted resource by ID' })
  @ApiResponse({ status: 200, description: 'Resource successfully restored.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  restore(@Param('id') id: string) {
    return this.resourceService.restore(id);
  }
}