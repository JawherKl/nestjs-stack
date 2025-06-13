import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private readonly keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
  private readonly realm = process.env.KEYCLOAK_REALM || 'realm-name';
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID || 'client-id';
  private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret';
  private readonly adminCli = process.env.KEYCLOAK_ADMIN_CLI || 'username-cli';
  private readonly adminUsername = process.env.KEYCLOAK_ADMIN_USERNAME || 'username';
  private readonly adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'password';

  private async getAdminToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.keycloakUrl}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.adminCli,
          username: this.adminUsername,
          password: this.adminPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Failed to get admin token: ${JSON.stringify(axiosError.response?.data)}`);
      throw new HttpException(
        `Failed to get admin token: ${
          axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error_description' in axiosError.response.data
            ? (axiosError.response.data as any).error_description
            : axiosError.message
        }`,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const adminToken = await this.getAdminToken();

      const response = await axios.post(
        `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
        {
          username: createUserDto.email,
          email: createUserDto.email,
          enabled: true,
          emailVerified: true,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          credentials: [
            {
              type: 'password',
              value: createUserDto.password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Get the created user ID from the Location header
      const locationHeader = response.headers.location;
      const userId = locationHeader ? locationHeader.split('/').pop() : null;

      if (!userId) {
        throw new HttpException('Failed to get created user ID', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Assign default role
      await this.assignDefaultRole(adminToken, userId);

      // Return the user ID explicitly
      return {
        id: userId,
        email: createUserDto.email
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Failed to create user: ${JSON.stringify(axiosError.response?.data)}`);
      
      throw new HttpException(
        `Failed to create user: ${
          axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error_description' in axiosError.response.data
            ? (axiosError.response.data as any).error_description
            : axiosError.message
        }`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async findUserByEmail(adminToken: string, email: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.keycloakUrl}/admin/realms/${this.realm}/users`,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      return response.data[0];
    } catch (error) {
      this.logger.error(`Failed to search for user: ${error.message}`);
      return null;
    }
  }

  private async assignDefaultRole(adminToken: string, userId: string): Promise<void> {
    try {
      // Get the default role
      const roleResponse = await axios.get(
        `${this.keycloakUrl}/admin/realms/${this.realm}/roles/user`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      // Assign the role to the user
      await axios.post(
        `${this.keycloakUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
        [roleResponse.data],
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      this.logger.error(`Failed to assign default role: ${error.message}`);
    }
  }

    async login(email: string, password: string): Promise<any> {
    try {
      this.logger.debug(`Attempting login for user: ${email}`);
      
      const response = await axios.post(
        `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'password',
          username: email,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.logger.debug('Login successful');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`Login failed: ${JSON.stringify(axiosError.response?.data)}`);
      
      throw new HttpException(
        (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'error_description' in axiosError.response.data
          ? (axiosError.response.data as any).error_description
          : 'Invalid credentials'),
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await axios.post(
        `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error) {
      throw new HttpException('Logout failed', HttpStatus.BAD_REQUEST);
    }
  }
}