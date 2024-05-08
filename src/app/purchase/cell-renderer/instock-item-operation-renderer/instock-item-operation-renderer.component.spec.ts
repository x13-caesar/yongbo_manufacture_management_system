import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockItemOperationRendererComponent } from './instock-item-operation-renderer.component';

describe('InstockItemOperationRendererComponent', () => {
  let component: InstockItemOperationRendererComponent;
  let fixture: ComponentFixture<InstockItemOperationRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockItemOperationRendererComponent]
    });
    fixture = TestBed.createComponent(InstockItemOperationRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
