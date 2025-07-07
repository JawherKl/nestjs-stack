import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from '../dto/create-pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.projectService.create(userId, dto);
  }

  @Get()
  @Roles('user')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term'
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.projectService.findAll(query);
  }

  @Get(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return project details.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'Project successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req: Request) {
    const userId = req.user?.['sub'];
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.projectService.update(id, dto, userId);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['sub'];
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.projectService.remove(id, userId);
  }

  @Post(':id/restore')
  @Roles('admin')
  @ApiOperation({ summary: 'Restore a deleted project by ID' })
  async restore(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['sub'];
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.projectService.restore(id, userId);
  }

  @Get('archived')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all archived projects' })
  @ApiResponse({ status: 200, description: 'Return all archived projects.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'No archived projects found.' })
  async findArchived() {
    return this.projectService.findArchived();
  }
}
