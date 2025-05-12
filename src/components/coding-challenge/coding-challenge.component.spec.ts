import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingChallengeComponent } from './coding-challenge.component';

describe('CodingChallengeComponent', () => {
  let component: CodingChallengeComponent;
  let fixture: ComponentFixture<CodingChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodingChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
