// models/question-textbox.ts
import { toISODateString } from '../utils/to-iso-date-string';
import { QuestionBase, QuestionConfig } from './question-base';

export type TextboxType = 'text' | 'email' | 'number' | 'password' | 'date';

// Base sin value (lo especializamos en cada variante)
type Base = Omit<QuestionConfig<string>, 'value'> & {
  type?: TextboxType;
};

// Variante para fecha: admite string | Date y min/max
export type TextboxConfigDate = Omit<Base, 'type'> & {
  type: 'date';
  value?: string | Date;
  min?: string | Date;
  max?: string | Date;
};

// Variante no-fecha: sólo string; sin min/max
export type TextboxConfigNonDate = Base & {
  type?: Exclude<TextboxType, 'date'>; // o undefined -> 'text' por defecto
  value?: string;
  min?: never;
  max?: never;
};

export type TextboxConfig = TextboxConfigDate | TextboxConfigNonDate;

export class TextboxQuestion extends QuestionBase<string> {
  override controlType: 'textbox' = 'textbox';
  type: TextboxType;
  /** Para date: siempre ISO 'YYYY-MM-DD' tras normalizar */
  min?: string;
  max?: string;

  constructor(options: TextboxConfig) {
    const normalizedValue: string | undefined =
      options.type === 'date' ? toISODateString(options.value) : options.value;

    super({ ...options, value: normalizedValue });

    this.type = options.type ?? 'text';

    if (this.type === 'date') {
      this.min = toISODateString(options.min);
      this.max = toISODateString(options.max);
    }
  }
}
