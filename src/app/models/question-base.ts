export type ControlType = 'textbox' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';

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
