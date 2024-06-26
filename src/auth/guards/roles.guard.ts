import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator.';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasApproval = requiredRoles.some(
      (role: string[]) => user.role === role,
    );
    if (!hasApproval)
      throw new UnauthorizedException('no permission to perform this action', {
        cause: new Error(),
        description: 'UnAuthorized',
      });
    return hasApproval;
  }
}
