import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormQuestion } from './dynamic-form-question';

describe('DynamicFormQuestion', () => {
  let component: DynamicFormQuestion;
  let fixture: ComponentFixture<DynamicFormQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
