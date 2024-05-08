import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullInDialogComponent } from './pull-in-dialog.component';

describe('PullInDialogComponent', () => {
  let component: PullInDialogComponent;
  let fixture: ComponentFixture<PullInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
