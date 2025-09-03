// models/question-textbox.ts
import { ControlType, QuestionBase, QuestionConfig } from './question-base';

export type TextInputType = 'text' | 'email' | 'number';

export interface TextboxQuestionConfig extends QuestionConfig<string> {
  type?: TextInputType;
}

export class TextboxQuestion extends QuestionBase<string> {
  override controlType: ControlType = 'textbox';
  type: TextInputType;

  constructor(cfg: TextboxQuestionConfig) {
    super(cfg);
    this.type = cfg.type ?? 'text';
  }
}
