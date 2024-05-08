import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenEmployeeComponent } from './hidden-employee.component';

describe('HiddenEmployeeComponent', () => {
  let component: HiddenEmployeeComponent;
  let fixture: ComponentFixture<HiddenEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
