import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../../user/enums/roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.getAllAndMerge<Roles[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    if (!roles) {
      return true;
    }

    let isAllowed = false;

    const request = context.switchToHttp().getRequest().user;

    roles.forEach((role) => {
      if (request.role === role) {
        isAllowed = true;
      }
    });

    return isAllowed;
  }
}
