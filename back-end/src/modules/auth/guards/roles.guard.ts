import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // getAllAndOverride kijkt eerst naar de methode en daarna naar de class.
    // Met alleen getHandler() werd @Roles() op class-niveau (zoals in
    // DocentController) genegeerd, waardoor de guard iedereen doorliet.
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Geen @Roles() ergens: de route vraagt geen specifieke rol.
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: Role } }>();
    const role = request.user?.role;

    return !!role && requiredRoles.includes(role);
  }
}
