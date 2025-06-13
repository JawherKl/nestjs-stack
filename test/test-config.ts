import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

export function setupTestEnv() {
  dotenv.config({ path: '.env.test' });
  
  return {
    provide: ConfigService,
    useValue: new ConfigService(),
  };
}