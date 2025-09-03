import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnyQuestion } from '../models/question-base';
import { QuestionControl } from '../services/question-control';
import { DynamicFormQuestion } from './dynamic-form-question';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  template: `
    <div>
      <form [formGroup]="form()" (ngSubmit)="onSubmit()">
        @for (question of questions(); track question.key) {
        <div class="form-row">
          <app-question [question]="question" [form]="form()" />
        </div>
        }
        <div class="form-row">
          <button type="submit" [disabled]="form().invalid">Save</button>
        </div>
      </form>

      @if (payLoad) {
      <div class="form-row">
        <strong>Saved the following values</strong><br />
        {{ payLoad }}
      </div>
      }
    </div>
  `,
  imports: [DynamicFormQuestion, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Si tu servicio ya tiene providedIn:'root', no hace falta providers aquí.
  // providers: [QuestionControl],
})
export class DynamicForm {
  private readonly qcs = inject(QuestionControl);

  // ✅ ahora el input es ya un AnyQuestion[] (sin nullables)
  readonly questions = input<AnyQuestion[]>([]);

  // ✅ el builder ya espera AnyQuestion[]; no hacen falta casts
  readonly form = computed<FormGroup>(() => this.qcs.toFormGroup(this.questions()));

  payLoad = '';

  onSubmit() {
    this.payLoad = JSON.stringify(this.form().getRawValue());
  }
}
