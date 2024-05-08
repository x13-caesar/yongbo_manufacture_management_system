import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecDialogComponent } from './edit-spec-dialog.component';

describe('EditSpecDialogComponent', () => {
  let component: EditSpecDialogComponent;
  let fixture: ComponentFixture<EditSpecDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSpecDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
