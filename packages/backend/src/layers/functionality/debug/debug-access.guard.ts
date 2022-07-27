import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class DebugAccessGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    return (
      request.headers.authorization ===
      `Bearer ${this.configService.get('auth').debugToken}`
    );
  }
}
