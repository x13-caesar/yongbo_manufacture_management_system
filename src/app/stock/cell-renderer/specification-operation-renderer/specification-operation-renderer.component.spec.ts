import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationOperationRendererComponent } from './specification-operation-renderer.component';

describe('SpecificationOperationRendererComponent', () => {
  let component: SpecificationOperationRendererComponent;
  let fixture: ComponentFixture<SpecificationOperationRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationOperationRendererComponent]
    });
    fixture = TestBed.createComponent(SpecificationOperationRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
