import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../../api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return false;
    const keyRecord = await this.apiKeyService.validate(apiKey);
    if (!keyRecord) throw new UnauthorizedException('Invalid or revoked API key');
    req.user = {
      userId: keyRecord.userId,
      projectId: keyRecord.projectId,
      roles: ['api-key'],
    };
    return true;
  }
}