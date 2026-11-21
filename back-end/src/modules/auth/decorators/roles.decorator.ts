import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Eén plek voor de metadata-sleutel: decorator en guard gebruiken dezelfde
// constante, zodat ze nooit uit elkaar kunnen lopen.
export const ROLES_KEY = 'roles';

// Typed op het Prisma-enum i.p.v. losse strings: een typfout als
// @Roles('DOCNET') geeft nu een compilatiefout.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
