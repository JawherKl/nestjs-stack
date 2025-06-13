import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/create-login.dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly keycloakService: KeycloakService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    try {
      this.logger.debug(`Login attempt for user: ${loginDto.email}`);
      
      const tokens = await this.keycloakService.login(
        loginDto.email,
        loginDto.password
      );
      
      const user = await this.userService.findByEmail(loginDto.email);

      if (!user) {
        this.logger.error(`User not found for email: ${loginDto.email}`);
        throw new Error('User not found');
      }
      
      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  async logout(@Body() { refreshToken }: { refreshToken: string }) {
    await this.keycloakService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }
}