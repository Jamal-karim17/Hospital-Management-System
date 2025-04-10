import { TestBed } from '@angular/core/testing';

import { PhamarcyService } from './phamarcy.service';

describe('PhamarcyService', () => {
  let service: PhamarcyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhamarcyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
