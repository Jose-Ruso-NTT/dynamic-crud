import { AsyncPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';

@Component({
  selector: 'app-question',
  template: `
    <div [formGroup]="form()">
      <label [attr.for]="question().key">{{ question().label }}</label>
      <div>
        @switch (question().controlType) { @case ('textbox') {

        <input
          [formControlName]="textboxQuestion().key"
          [id]="textboxQuestion().key"
          [type]="textboxQuestion().type"
        />
        } @case ('dropdown') {
        <select [id]="dropdownQuestion().key" [formControlName]="dropdownQuestion().key">
          @for (opt of dropdownQuestion().options$ | async; track opt) {
          <option [value]="opt.key">{{ opt.value }}</option>
          }
        </select>
        } }
      </div>
      @if (!isValid) {
      <div class="errorMessage">{{ question().label }} is required</div>
      }
    </div>
  `,
  imports: [ReactiveFormsModule, AsyncPipe],
})
export class DynamicFormQuestion {
  readonly question = input.required<QuestionBase<unknown>>();
  readonly form = input.required<FormGroup>();

  dropdownQuestion = computed(() => this.question() as DropdownQuestion);
  textboxQuestion = computed(() => this.question() as TextboxQuestion);

  get isValid() {
    return this.form().controls[this.question().key].valid;
  }
}
