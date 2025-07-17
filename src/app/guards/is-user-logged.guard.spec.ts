import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isUserLoggedGuard } from './is-user-logged.guard';

describe('isUserLoggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isUserLoggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
