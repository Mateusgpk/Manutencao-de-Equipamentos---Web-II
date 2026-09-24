import { TestBed } from '@angular/core/testing';

import { Apicep } from './apicep';

describe('Apicep', () => {
  let service: Apicep;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Apicep);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
