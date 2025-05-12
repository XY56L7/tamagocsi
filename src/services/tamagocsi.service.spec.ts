import { TestBed } from '@angular/core/testing';

import { TamagocsiService } from './tamagocsi.service';

describe('TamagocsiService', () => {
  let service: TamagocsiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TamagocsiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
