import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecComponent } from './create-spec.component';

describe('CreateSpecComponent', () => {
  let component: CreateSpecComponent;
  let fixture: ComponentFixture<CreateSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSpecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
