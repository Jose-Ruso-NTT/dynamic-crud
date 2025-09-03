// models/question-dropdown.ts
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ControlType, QuestionBase, QuestionConfig } from './question-base';
import { Option } from './types';

type StaticOptionsConfig = {
  options: Option[];
  optionsLoader?: never;
};

type DynamicOptionsConfig = {
  options?: never;
  optionsLoader: () => Observable<Option[]>;
};

export type DropdownQuestionConfig = (StaticOptionsConfig | DynamicOptionsConfig) &
  QuestionConfig<string>;

export class DropdownQuestion extends QuestionBase<string> {
  override controlType: ControlType = 'dropdown';
  readonly options$: Observable<Option[]>;

  constructor(cfg: DropdownQuestionConfig) {
    super(cfg);

    if (cfg.options) {
      this.options$ = of(cfg.options);
    } else if (cfg.optionsLoader) {
      this.options$ = cfg.optionsLoader().pipe(
        catchError((err) => {
          console.error(`[DropdownQuestion:${this.key}] Error cargando opciones`, err);
          return of([] as Option[]);
        }),
        // Evita llamadas repetidas si hay múltiples suscripciones
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
      this.options$ = of([]);
    }
  }
}
