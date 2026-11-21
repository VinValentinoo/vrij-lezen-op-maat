import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorators/roles.decorator';

// Echte decorators op testklassen, zodat we exact het gedrag van de
// controllers nabootsen (de oorspronkelijke bug zat in class-level @Roles).
@Roles('DOCENT')
class ClassLevelController {
  methode() {}
}

class MethodLevelController {
  @Roles('STUDENT')
  alleenStudent() {}

  open() {}
}

@Roles('DOCENT')
class OverrideController {
  @Roles('STUDENT')
  alleenStudent() {}
}

function maakContext(
  controller: new () => unknown,
  methode: string,
  user?: { role?: string },
): ExecutionContext {
  return {
    getHandler: () => (controller.prototype as Record<string, () => void>)[methode],
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard(new Reflector());
  });

  it('laat een DOCENT door bij @Roles op class-niveau', () => {
    const ctx = maakContext(ClassLevelController, 'methode', { role: 'DOCENT' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('weigert een STUDENT bij @Roles("DOCENT") op class-niveau (regressietest voor de bug)', () => {
    const ctx = maakContext(ClassLevelController, 'methode', { role: 'STUDENT' });
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('weigert als er geen user op het request staat', () => {
    const ctx = maakContext(ClassLevelController, 'methode', undefined);
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('weigert als de user geen rol heeft', () => {
    const ctx = maakContext(ClassLevelController, 'methode', {});
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('respecteert @Roles op methode-niveau', () => {
    expect(
      guard.canActivate(
        maakContext(MethodLevelController, 'alleenStudent', { role: 'STUDENT' }),
      ),
    ).toBe(true);
    expect(
      guard.canActivate(
        maakContext(MethodLevelController, 'alleenStudent', { role: 'DOCENT' }),
      ),
    ).toBe(false);
  });

  it('methode-niveau gaat voor class-niveau (override)', () => {
    const ctx = maakContext(OverrideController, 'alleenStudent', { role: 'STUDENT' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('laat iedereen door als er nergens @Roles staat', () => {
    const ctx = maakContext(MethodLevelController, 'open', { role: 'STUDENT' });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
