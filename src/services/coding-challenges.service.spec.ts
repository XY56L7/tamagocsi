import { TestBed } from '@angular/core/testing';

import { CodingChallengesService } from './coding-challenges.service';

describe('CodingChallengesService', () => {
  let service: CodingChallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodingChallengesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
