import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UnverifiedEmailError } from 'src/common/errors/verified-email.error';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user = request.user;

    if (!user.isEmailVerified) {
      throw new UnverifiedEmailError();
    }

    return true;
  }
}

// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { UnverifiedEmailError } from 'src/common/errors/verified-email.error';
// import { UserService } from 'src/layers/storage/services/user.service';

// @Injectable()
// export class EmailVerifiedGuard implements CanActivate {
//   constructor(private userService: UserService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const ctx = context.switchToHttp();
//     const request = ctx.getRequest();
//     const user = await this.userService.getByEmail(request.user.email);

//     if (!user.isEmailVerified) {
//       throw new UnverifiedEmailError();
//     }

//     return true;
//   }
// }
