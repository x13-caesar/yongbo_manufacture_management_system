import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockItemListComponent } from './instock-item-list.component';

describe('InstockItemListComponent', () => {
  let component: InstockItemListComponent;
  let fixture: ComponentFixture<InstockItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockItemListComponent]
    });
    fixture = TestBed.createComponent(InstockItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
