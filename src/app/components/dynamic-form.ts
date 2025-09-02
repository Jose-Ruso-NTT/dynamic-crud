import { Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../models/question-base';
import { QuestionControl } from '../services/question-control';
import { DynamicFormQuestion } from './dynamic-form-question';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <div>
      <form (ngSubmit)="onSubmit()" [formGroup]="form()">
        @for (question of questions(); track question) {
        <div class="form-row">
          <app-question [question]="question" [form]="form()" />
        </div>
        }
        <div class="form-row">
          <button type="submit" [disabled]="!form().valid">Save</button>
        </div>
      </form>

      @if (payLoad) {
      <div class="form-row"><strong>Saved the following values</strong><br />{{ payLoad }}</div>
      }
    </div>
  `,
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
