import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewRendererComponentComponent } from './image-view-renderer-component.component';

describe('ImageViewRendererComponentComponent', () => {
  let component: ImageViewRendererComponentComponent;
  let fixture: ComponentFixture<ImageViewRendererComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageViewRendererComponentComponent]
    });
    fixture = TestBed.createComponent(ImageViewRendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
