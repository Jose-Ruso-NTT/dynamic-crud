import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnyQuestion } from '../models/question-base';
import { QuestionControl } from '../services/question-control';
import { DynamicFormQuestion } from './dynamic-form-question';

@Component({
  selector: 'app-dynamic-form',
  imports: [DynamicFormQuestion, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form()" (ngSubmit)="onSubmit()" class="df" data-testid="dynamic-form">
      @for (question of questions(); track question.key) {
      <div app-question [question]="question" [form]="form()" data-testid="question-item"></div>
      }

      <div class="df__actions">
        <button type="submit" [disabled]="form().invalid">Save</button>
      </div>
    </form>

    @if (payLoad) {
    <strong>Saved the following values</strong><br />
    {{ payLoad }}
    }
  `,
  styles: [
    `
      .df {
        display: flex;
        flex-wrap: wrap;
      }

      .df__actions {
        flex: 1 1 100%;
        display: flex;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class DynamicForm {
  private readonly qcs = inject(QuestionControl);

  readonly questions = input<AnyQuestion[]>([]);

  readonly form = computed<FormGroup>(() => {
    const fg = this.qcs.toFormGroup(this.questions());
    this.qcs.wireDependencies(fg, this.questions());
    return fg;
  });

  payLoad = '';

  populateTable() {
    this.form().setValue({
      firstName: 'Nancy',
      favoriteAnimal: 'Capybara',
      birthDate: '2025-09-04',
      user: 'Leanne Graham',
    });
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form().getRawValue());
  }
}
