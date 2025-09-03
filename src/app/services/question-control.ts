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
import { AnyQuestion, ArrayQuestion, GroupQuestion } from '../models/question-base';
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
}
