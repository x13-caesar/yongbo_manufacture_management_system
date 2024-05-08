import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInstockFormComponent } from './create-instock-form.component';

describe('CreateInstockFormComponent', () => {
  let component: CreateInstockFormComponent;
  let fixture: ComponentFixture<CreateInstockFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInstockFormComponent]
    });
    fixture = TestBed.createComponent(CreateInstockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
