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
  selector: 'div[app-question]',
  imports: [ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form()">
      <label [attr.for]="question().key">{{ question().label }}</label>

      @switch (question().controlType) { @case ('textbox') {
      <input
        [formControlName]="textbox().key"
        [id]="textbox().key"
        [type]="textbox().type || 'text'"
        [attr.min]="textbox().min ?? null"
        [attr.max]="textbox().max ?? null"
      />
      } @case ('dropdown') {
      <select [id]="dropdown().key" [formControlName]="dropdown().key">
        @for (opt of (dropdown().options$ | async); track opt.key) {
        <option [value]="opt.key">{{ opt.value }}</option>
        }
      </select>
      } @case ('array') {
      <div [formArrayName]="arrayQ().key" class="arr">
        @for (ctrl of arrayCtrl.controls; track i; let i = $index) {
        <fieldset [formGroupName]="i">
          @for (child of arrayQ().itemQuestions; track child.key) {
          <div app-question [question]="child" [form]="groupAt(i)"></div>
          }
          <br />
          <button type="button" (click)="removeItem(i)">Quitar</button>
        </fieldset>
        }
        <button type="button" (click)="addItem()" [disabled]="arrayCtrl.invalid">Añadir</button>
      </div>
      } } @if (!isValid) {
      <div class="errorMessage">{{ question().label }} is required</div>
      }
    </div>
  `,
  styles: [
    `
      /* El host ES el <div app-question> → card + 2→1 sin media queries */
      :host {
        box-sizing: border-box;
        display: block;
        width: clamp(22rem, 50%, 100%);
        flex: 1 1 auto;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
        background: #fff;
      }

      /* Cuando el question vive DENTRO de un fieldset (arrays):
       - Reutiliza el 2→1, pero sin borde/padding de “card” para evitar cards anidadas */
      :host-context(fieldset) {
        border: 0;
        padding: 0;
        background: transparent;
        width: clamp(20rem, 50%, 100%);
      }

      /* Layout interno básico */
      :host div[formGroup] {
        display: grid;
        gap: 0.5rem;
      }

      label {
        font-weight: 600;
      }

      input,
      select {
        width: 100%;
        min-height: 2.25rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: #fff;
      }

      /* ARRAY: el contenedor y los fieldsets en flex para heredar el 2→1 */
      .arr {
        display: grid;
        gap: 0.75rem;
      }

      fieldset {
        border: 1px dashed #e5e7eb;
        border-radius: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .errorMessage {
        color: #b91c1c;
        font-size: 0.875rem;
      }
    `,
  ],
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
