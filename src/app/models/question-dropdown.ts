// models/question-dropdown.ts
import { Observable, of, shareReplay } from 'rxjs';
import { QuestionBase, QuestionConfig } from './question-base';
import { Option } from './types';

export interface DropdownConfig extends QuestionConfig<string> {
  optionsLoader?: () => Observable<Option[]>; // no dependiente
  options?: Option[]; // estático
  dependsOn?: string; // key padre
  resetOnChange?: boolean; // default true
  loadFor?: (depValue: string | null | undefined) => Observable<Option[]>; // dependiente
}

export class DropdownQuestion extends QuestionBase<string> {
  override controlType: 'dropdown' = 'dropdown';

  options$: Observable<Option[]>;
  dependsOn?: string;
  resetOnChange: boolean;
  loadFor?: (depValue: string | null | undefined) => Observable<Option[]>;

  constructor(cfg: DropdownConfig) {
    super(cfg);
    this.dependsOn = cfg.dependsOn;
    this.resetOnChange = cfg.resetOnChange ?? true;
    this.loadFor = cfg.loadFor;

    if (cfg.optionsLoader) {
      this.options$ = cfg.optionsLoader().pipe(shareReplay(1));
    } else if (cfg.options) {
      this.options$ = of(cfg.options);
    } else {
      this.options$ = of([]);
    }
  }
}
