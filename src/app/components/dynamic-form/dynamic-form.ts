import { Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../../models/question-base';
import { QuestionControl } from '../../services/question-control';
import { DynamicFormQuestion } from '../dynamic-form-question/dynamic-form-question';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  providers: [QuestionControl],
  imports: [DynamicFormQuestion, ReactiveFormsModule],
})
export class DynamicForm {
  private readonly qcs = inject(QuestionControl);

  readonly questions = input<QuestionBase<string>[] | null>([]);

  readonly form = computed<FormGroup>(() =>
    this.qcs.toFormGroup(this.questions() as QuestionBase<string>[])
  );

  payLoad = '';

  onSubmit() {
    this.payLoad = JSON.stringify(this.form().getRawValue());
  }
}
