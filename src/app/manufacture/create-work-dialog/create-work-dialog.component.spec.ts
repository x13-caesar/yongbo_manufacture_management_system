import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkDialogComponent } from './create-work-dialog.component';

describe('CreateWorkDialogComponent', () => {
  let component: CreateWorkDialogComponent;
  let fixture: ComponentFixture<CreateWorkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
