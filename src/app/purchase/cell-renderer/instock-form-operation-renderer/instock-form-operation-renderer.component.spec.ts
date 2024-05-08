import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockFormOperationRendererComponent } from './instock-form-operation-renderer.component';

describe('InstockFormOperationRendererComponent', () => {
  let component: InstockFormOperationRendererComponent;
  let fixture: ComponentFixture<InstockFormOperationRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockFormOperationRendererComponent]
    });
    fixture = TestBed.createComponent(InstockFormOperationRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
