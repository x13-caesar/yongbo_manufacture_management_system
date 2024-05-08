import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentOperationRendererComponent } from './component-operation-renderer.component';

describe('ComponentOperationRendererComponent', () => {
  let component: ComponentOperationRendererComponent;
  let fixture: ComponentFixture<ComponentOperationRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentOperationRendererComponent]
    });
    fixture = TestBed.createComponent(ComponentOperationRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
