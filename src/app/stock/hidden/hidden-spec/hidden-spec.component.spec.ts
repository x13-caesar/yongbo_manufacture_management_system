import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSpecComponent } from './hidden-spec.component';

describe('HiddenSpecComponent', () => {
  let component: HiddenSpecComponent;
  let fixture: ComponentFixture<HiddenSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenSpecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
