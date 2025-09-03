// models/question-dto.ts
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
  type?: 'text' | 'email' | 'number' | 'password' | 'date';
  min?: string; // para 'date' => 'YYYY-MM-DD'
  max?: string; // para 'date'
  value?: string; // (si es date: 'YYYY-MM-DD')
}

export interface DropdownDTO extends QuestionDTOBase {
  controlType: 'dropdown';
  // O bien opciones estáticas:
  options?: { key: string; value: string }[];
  // O bien cargar desde endpoint:
  optionsUrl?: string;
  keyField?: string; // campo del objeto remoto a usar como key (default: 'id' o 'name')
  valueField?: string; // campo del objeto remoto a usar como value (default: 'name')
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
