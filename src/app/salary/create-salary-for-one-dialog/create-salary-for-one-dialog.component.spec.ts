import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSalaryForOneDialogComponent } from './create-salary-for-one-dialog.component';

describe('CreateSalaryForOneDialogComponent', () => {
  let component: CreateSalaryForOneDialogComponent;
  let fixture: ComponentFixture<CreateSalaryForOneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSalaryForOneDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSalaryForOneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
