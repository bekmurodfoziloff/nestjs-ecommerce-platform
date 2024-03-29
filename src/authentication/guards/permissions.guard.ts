import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Permission from '../../utils/permission.type';
import { PermissionsKey } from '../../utils/permission.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PermissionsKey, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission) => user.permissions?.includes(permission));
  }
}
