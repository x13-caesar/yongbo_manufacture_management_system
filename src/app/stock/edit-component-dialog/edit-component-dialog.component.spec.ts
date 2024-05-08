import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentDialogComponent } from './edit-component-dialog.component';

describe('EditComponentDialogComponent', () => {
  let component: EditComponentDialogComponent;
  let fixture: ComponentFixture<EditComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditComponentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
