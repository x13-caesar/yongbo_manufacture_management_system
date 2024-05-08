import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCategoryDialogComponent } from './add-product-category-dialog.component';

describe('AddProductCategoryDialogComponent', () => {
  let component: AddProductCategoryDialogComponent;
  let fixture: ComponentFixture<AddProductCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
