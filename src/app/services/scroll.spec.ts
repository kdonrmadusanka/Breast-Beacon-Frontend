import { TestBed } from '@angular/core/testing';

import { Scroll } from './scroll';

describe('Scroll', () => {
  let service: Scroll;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scroll);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
