import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockEventCellRendererComponent } from './instock-event-cell-renderer.component';

describe('InstockEventCellRendererComponent', () => {
  let component: InstockEventCellRendererComponent;
  let fixture: ComponentFixture<InstockEventCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockEventCellRendererComponent]
    });
    fixture = TestBed.createComponent(InstockEventCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
