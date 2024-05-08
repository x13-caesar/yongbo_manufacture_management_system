import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePurchaseInfoComponent } from './update-purchase-info.component';

describe('UpdatePurchaseInfoComponent', () => {
  let component: UpdatePurchaseInfoComponent;
  let fixture: ComponentFixture<UpdatePurchaseInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePurchaseInfoComponent]
    });
    fixture = TestBed.createComponent(UpdatePurchaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
