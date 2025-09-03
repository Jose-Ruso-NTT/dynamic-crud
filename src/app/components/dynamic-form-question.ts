import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnyQuestion, ArrayQuestion } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';
import { QuestionControl } from '../services/question-control';

type AnyGroupControls = Record<string, AbstractControl<any, any>>;
type AnyFormGroup = FormGroup<AnyGroupControls>;

@Component({
  selector: 'app-question',
  standalone: true,
  template: `
    <div [formGroup]="form()">
      <label [attr.for]="question().key">{{ question().label }}</label>

      <div>
        @switch (question().controlType) {
        <!--  -->
        @case ('textbox') {
        <input
          [formControlName]="textbox().key"
          [id]="textbox().key"
          [type]="textbox().type || 'text'"
          [attr.min]="textbox().min ?? null"
          [attr.max]="textbox().max ?? null"
        />
        }
        <!--  -->
        @case ('dropdown') {
        <select [id]="dropdown().key" [formControlName]="dropdown().key">
          @for (opt of (dropdown().options$ | async); track opt.key) {
          <option [value]="opt.key">{{ opt.value }}</option>
          }
        </select>
        }
        <!--  -->
        @case ('array') {
        <div [formArrayName]="arrayQ().key">
          @for (ctrl of arrayCtrl.controls; track i; let i = $index) {
          <fieldset [formGroupName]="i">
            @for (child of arrayQ().itemQuestions; track child.key) {
            <app-question [question]="child" [form]="groupAt(i)" />
            }
            <button type="button" (click)="removeItem(i)">Quitar</button>
          </fieldset>
          }
          <button type="button" (click)="addItem()" [disabled]="arrayCtrl.invalid">Añadir</button>
        </div>
        } }
      </div>

      @if (!isValid) {
      <div class="errorMessage">{{ question().label }} is required</div>
      }
    </div>
  `,
  imports: [ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormQuestion {
  private readonly qc = inject(QuestionControl);

  readonly question = input.required<AnyQuestion>();
  readonly form = input.required<FormGroup>();

  textbox = computed(() => this.question() as TextboxQuestion);
  dropdown = computed(() => this.question() as DropdownQuestion);
  arrayQ = computed(() => this.question() as ArrayQuestion);

  get isValid() {
    return this.form().controls[this.question().key].valid;
  }

  // ✅ Tipa el FormArray como de grupos
  get arrayCtrl(): FormArray<AnyFormGroup> {
    return this.form().get(this.arrayQ().key) as FormArray<AnyFormGroup>;
  }

  groupAt(i: number): AnyFormGroup {
    return this.arrayCtrl.at(i);
  }

  // ✅ Usa el builder para crear el grupo del ítem
  addItem() {
    const itemFg = this.qc.toFormGroup(this.arrayQ().itemQuestions as AnyQuestion[]);
    this.arrayCtrl.push(itemFg);
  }

  removeItem(i: number) {
    this.arrayCtrl.removeAt(i);
  }
}
