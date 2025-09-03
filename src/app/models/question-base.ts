import { DropdownQuestion } from './question-dropdown';
import { TextboxQuestion } from './question-textbox';

export type ControlType =
  | 'textbox'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'textarea'
  | 'group'
  | 'array';

export interface QuestionConfig<T> {
  key: string;
  label?: string;
  value?: T;
  required?: boolean;
  order?: number;
  controlType?: ControlType;
}

export class QuestionBase<T> {
  value?: T;
  key: string;
  label?: string;
  required: boolean;
  order: number;
  controlType: ControlType;

  constructor(options: QuestionConfig<T>) {
    this.key = options.key;
    this.label = options.label;
    this.value = options.value;
    this.required = !!options.required;
    this.order = options.order ?? 1;
    this.controlType = options.controlType ?? 'textbox';
  }
}

// 👇 Adelanta la declaración para poder referenciar AnyQuestion.
export type AnyQuestion = TextboxQuestion | DropdownQuestion | GroupQuestion | ArrayQuestion;

export interface GroupQuestion extends QuestionBase<unknown> {
  controlType: 'group';
  children: AnyQuestion[];
}

export interface ArrayQuestion extends QuestionBase<unknown> {
  controlType: 'array';
  itemQuestions: AnyQuestion[];
  initialItems?: unknown[];
  minItems?: number;
  maxItems?: number;
}
