import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnhideSpecDialogComponent } from './unhide-spec-dialog.component';

describe('UnhideSpecDialogComponent', () => {
  let component: UnhideSpecDialogComponent;
  let fixture: ComponentFixture<UnhideSpecDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnhideSpecDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnhideSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
