import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamagocsiComponent } from './tamagocsi.component';

describe('TamagocsiComponent', () => {
  let component: TamagocsiComponent;
  let fixture: ComponentFixture<TamagocsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamagocsiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamagocsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
