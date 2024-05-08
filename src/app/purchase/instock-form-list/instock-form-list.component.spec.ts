import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockFormListComponent } from './instock-form-list.component';

describe('PurchaseComponent', () => {
  let component: InstockFormListComponent;
  let fixture: ComponentFixture<InstockFormListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockFormListComponent]
    });
    fixture = TestBed.createComponent(InstockFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
