import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private keycloakService: KeycloakService
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create user in Keycloak first
    const keycloakUser = await this.keycloakService.createUser(createUserDto);

    // Create user in database with Keycloak ID
    return this.prisma.user.create({
      data: {
        id: keycloakUser.id, // Use the Keycloak user ID
        name: `${createUserDto.firstName} ${createUserDto.lastName}`,
        email: createUserDto.email,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
}