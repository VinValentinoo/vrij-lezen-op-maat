import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

// Samengestelde decorator (NestJS-concept: applyDecorators). Eén regel in
// plaats van @UseGuards + @Roles + @ApiBearerAuth op elke controller:
//
//   @Auth()           -> alleen ingelogd zijn
//   @Auth('DOCENT')   -> ingelogd en rol DOCENT
export function Auth(...roles: Role[]) {
  const decorators = [
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Niet ingelogd of token verlopen' }),
  ];

  if (roles.length > 0) {
    decorators.push(
      Roles(...roles),
      ApiForbiddenResponse({ description: 'Je rol heeft geen toegang' }),
    );
  }

  return applyDecorators(...decorators);
}
