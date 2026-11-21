import { Role } from '@prisma/client';
import { Request } from 'express';

// Wat JwtStrategy.validate() teruggeeft en Passport op request.user zet.
export interface AuthenticatedUser {
  userId: string;
  naam: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
