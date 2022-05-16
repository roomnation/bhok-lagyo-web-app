import { TestBed } from '@angular/core/testing';

import { BlacklistGuard } from './blacklist.guard';

describe('BlacklistGuard', () => {
  let guard: BlacklistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlacklistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
