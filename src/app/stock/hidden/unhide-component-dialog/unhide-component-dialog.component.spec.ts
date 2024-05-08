import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnhideComponentDialogComponent } from './unhide-component-dialog.component';

describe('UnhideComponentDialogComponent', () => {
  let component: UnhideComponentDialogComponent;
  let fixture: ComponentFixture<UnhideComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnhideComponentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnhideComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
