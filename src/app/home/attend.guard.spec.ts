import { TestBed } from '@angular/core/testing';

import { AttendGuard } from './attend.guard';

describe('AttendGuard', () => {
  let guard: AttendGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AttendGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
