import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { autenticadorGuard } from './autenticador-guard';

describe('autenticadorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => autenticadorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
