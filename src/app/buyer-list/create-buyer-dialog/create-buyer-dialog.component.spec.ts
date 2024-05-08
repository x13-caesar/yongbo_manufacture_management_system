import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuyerDialogComponent } from './create-buyer-dialog.component';

describe('CreateBuyerDialogComponent', () => {
  let component: CreateBuyerDialogComponent;
  let fixture: ComponentFixture<CreateBuyerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBuyerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBuyerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
