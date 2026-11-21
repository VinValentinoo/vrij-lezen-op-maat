import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../types/authenticated-request';

// Custom param-decorator (NestJS-concept): haalt de ingelogde gebruiker uit het
// request, zodat controllers niet het hele Express-request hoeven te injecteren.
//
//   @CurrentUser() user              -> { userId, naam, role }
//   @CurrentUser('userId') userId    -> alleen het id
export const CurrentUser = createParamDecorator(
  (field: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return field ? request.user?.[field] : request.user;
  },
);
