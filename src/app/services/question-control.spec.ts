import { TestBed } from '@angular/core/testing';

import { QuestionControl } from './question-control';

describe('QuestionControl', () => {
  let service: QuestionControl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionControl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
