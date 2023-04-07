import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
@Injectable()
export class IsEmailVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IRequestWithUser>();

    return request.user.isEmailVerified;
  }
}
