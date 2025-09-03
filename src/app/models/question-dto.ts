import { ControlType } from './question-base';

export interface QuestionDTOBase {
  controlType: ControlType;
  key: string;
  label?: string;
  required?: boolean;
  order?: number;
  value?: unknown; // según el tipo
}

export interface TextboxDTO extends QuestionDTOBase {
  controlType: 'textbox';
  type?: 'text' | 'email' | 'number' | 'date';
  min?: string; // para 'date' => 'YYYY-MM-DD'
  max?: string; // para 'date'
  value?: string; // (si es date: 'YYYY-MM-DD')
}

export interface DropdownDTO extends QuestionDTOBase {
  controlType: 'dropdown';
  options?: { key: string; value: string }[]; // 1) opciones estáticas
  optionsUrl?: string; // 2) opciones remotas (no dependiente)
  optionsUrlTemplate?: string; // 3) opciones remotas dependientes del padre, usa "{value}"
  keyField?: string; // mapeo del campo "key" en la respuesta remota
  valueField?: string; // mapeo del campo "value" en la respuesta remota
  dependsOn?: string; // clave del control padre del que depende
  resetOnChange?: boolean; // si true, resetea el valor cuando cambia el padre (default true)
}

export interface GroupDTO extends QuestionDTOBase {
  controlType: 'group';
  children: QuestionDTO[];
}

export interface ArrayDTO extends QuestionDTOBase {
  controlType: 'array';
  itemQuestions: QuestionDTO[];
  // puedes usar initialCount si no quieres mandar payloads vacíos
  initialCount?: number;
}

export type QuestionDTO = TextboxDTO | DropdownDTO | GroupDTO | ArrayDTO;
