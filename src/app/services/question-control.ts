// services/question-control.ts
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { AnyQuestion, ArrayQuestion, GroupQuestion } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';

type AnyGroupControls = Record<string, AbstractControl<any, any>>;
type AnyFormGroup = FormGroup<AnyGroupControls>;

function minDateValidator(minISO: string): ValidatorFn {
  return (c: AbstractControl<string | null>) =>
    !c.value || c.value >= minISO ? null : { minDate: { min: minISO, actual: c.value } };
}
function maxDateValidator(maxISO: string): ValidatorFn {
  return (c: AbstractControl<string | null>) =>
    !c.value || c.value <= maxISO ? null : { maxDate: { max: maxISO, actual: c.value } };
}

@Injectable({ providedIn: 'root' })
export class QuestionControl {
  toFormGroup(questions: AnyQuestion[]): AnyFormGroup {
    const group: AnyGroupControls = {};
    for (const q of questions) group[q.key] = this.buildControl(q);
    return new FormGroup<AnyGroupControls>(group);
  }

  private buildControl(q: AnyQuestion): AbstractControl<any, any> {
    switch (q.controlType) {
      case 'group': {
        const gq = q as GroupQuestion;
        return this.toFormGroup(gq.children);
      }
      case 'array': {
        const aq = q as ArrayQuestion;
        const arr = new FormArray<AnyFormGroup>([]);
        const count = aq.initialItems?.length ?? 0;
        for (let i = 0; i < count; i++) arr.push(this.toFormGroup(aq.itemQuestions));
        return arr;
      }
      case 'textbox': {
        const tq = q as TextboxQuestion;
        const validators = tq.required ? [Validators.required] : [];
        if (tq.type === 'date') {
          if (tq.min) validators.push(minDateValidator(tq.min));
          if (tq.max) validators.push(maxDateValidator(tq.max));
        }
        return new FormControl<string | null>(tq.value ?? null, validators);
      }
      default: {
        const validators = q.required ? [Validators.required] : [];
        return new FormControl<any>(q.value ?? null, validators);
      }
    }
  }

  wireDependencies(form: FormGroup, questions: AnyQuestion[]): void {
    for (const q of this.flatten(questions)) {
      if (q.controlType !== 'dropdown') continue;
      const dq = q as DropdownQuestion;
      if (!dq.dependsOn || !dq.loadFor) continue;

      const parent = form.get(dq.dependsOn);
      const child = form.get(dq.key);
      if (!parent || !child) continue;

      // options$ depende del valor del padre (incluye valor inicial)
      dq.options$ = parent.valueChanges.pipe(
        startWith(parent.value),
        distinctUntilChanged(),
        tap(() => {
          // reset al cambiar el padre
          if (dq.resetOnChange) child.reset();
        }),
        tap((val) => {
          // enable/disable del hijo
          if (val == null || val === '') child.disable({ emitEvent: false });
          else child.enable({ emitEvent: false });
        }),
        switchMap((val) => (val == null || val === '' ? of([]) : dq.loadFor!(val))),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
  }

  private flatten(questions: AnyQuestion[]): AnyQuestion[] {
    const acc: AnyQuestion[] = [];
    for (const q of questions) {
      acc.push(q);
      if (q.controlType === 'group') acc.push(...this.flatten(q.children));
      else if (q.controlType === 'array') acc.push(...this.flatten(q.itemQuestions));
    }
    return acc;
  }
}
