// services/question.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AnyQuestion, ArrayQuestion, GroupQuestion } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { ArrayDTO, DropdownDTO, GroupDTO, QuestionDTO, TextboxDTO } from '../models/question-dto';
import { TextboxConfig, TextboxQuestion } from '../models/question-textbox';
import { Option } from '../models/types';

@Injectable({ providedIn: 'root' })
export class Question {
  private http = inject(HttpClient);
  getQuestionsFromJson(url = '/assets/questions.json'): Observable<AnyQuestion[]> {
    return this.http
      .get<QuestionDTO[]>(url)
      .pipe(map((dtos) => this.mapDTOs(dtos).sort((a, b) => (a.order ?? 1) - (b.order ?? 1))));
  }

  getQuestions(): Observable<AnyQuestion[]> {
    const q1 = new TextboxQuestion({
      key: 'firstName',
      label: 'First name',
      value: 'Alex',
      required: true,
      order: 1,
      type: 'text',
    });

    const q2 = new DropdownQuestion({
      key: 'favoriteAnimal',
      label: 'Favorite Animal',
      order: 2,
      optionsLoader: () =>
        of<Option[]>([
          { key: 'Capybara', value: 'Capybara' },
          { key: 'Zebra', value: 'Zebra' },
        ]),
    });

    const q3 = new DropdownQuestion({
      key: 'user',
      label: 'Users',
      order: 3,
      optionsLoader: () =>
        this.http
          .get<any[]>('https://jsonplaceholder.typicode.com/users')
          .pipe(map((arr) => arr.map<Option>((c) => ({ key: c.name, value: c.name })))),
    });

    const q4 = new TextboxQuestion({
      key: 'otherName',
      label: 'Other name',
      required: false,
      order: 4,
      type: 'text',
    });

    const birthDate = new TextboxQuestion({
      key: 'birthDate',
      label: 'Fecha de nacimiento',
      type: 'date',
      value: '1990-01-01', // o new Date(1990, 0, 1)
      min: '1900-01-01',
      max: '2025-12-31',
      order: 2,
      required: true,
    });

    const addresses: ArrayQuestion = {
      controlType: 'array',
      key: 'addresses',
      label: 'Direcciones',
      order: 5,
      required: false,
      // cada ítem del array tendrá estos campos:
      itemQuestions: [
        new TextboxQuestion({ key: 'street', label: 'Calle', order: 1, required: true }),
        new TextboxQuestion({ key: 'city', label: 'Ciudad', order: 2 }),
        q4,
      ],
      initialItems: [{}], // crea 1 fila inicial (opcional)
    };

    const questions: AnyQuestion[] = [q1, q2, q3, birthDate, addresses];

    // ordena por order (opcional)
    return of(questions.sort((a, b) => (a.order ?? 1) - (b.order ?? 1)));
  }

  //region ---------- Mapper principal ----------
  private mapDTOs(dtos: QuestionDTO[]): AnyQuestion[] {
    return dtos.map((dto) => this.mapDTO(dto));
  }

  private mapDTO(dto: QuestionDTO): AnyQuestion {
    switch (dto.controlType) {
      case 'textbox':
        return this.mapTextbox(dto);
      case 'dropdown':
        return this.mapDropdown(dto);
      case 'group':
        return this.mapGroup(dto); // ✅ ahora devuelve GroupQuestion bien tipado
      case 'array':
        return this.mapArray(dto); // (ya lo tienes)
      default: {
        // chequeo exhaustivo en compile-time
        const _exhaustive: never = dto;
        throw new Error(`Unsupported controlType: ${(dto as any).controlType}`);
      }
    }
  }

  private mapTextbox(dto: TextboxDTO): TextboxQuestion {
    const t = dto.type ?? 'text';

    if (t === 'date') {
      // ✅ Rama 'date': permitimos min/max y value (YYYY-MM-DD)
      const cfg: TextboxConfig = {
        key: dto.key,
        label: dto.label,
        required: dto.required,
        order: dto.order,
        type: 'date', // <-- narrowing explícito
        value: dto.value, // string | undefined (JSON no lleva Date)
        min: dto.min, // 'YYYY-MM-DD' | undefined
        max: dto.max, // 'YYYY-MM-DD' | undefined
      };
      return new TextboxQuestion(cfg);
    } else {
      // ✅ Rama no-date: NO pasamos min/max, y type nunca es 'date'
      const cfg: TextboxConfig = {
        key: dto.key,
        label: dto.label,
        required: dto.required,
        order: dto.order,
        type: t, // 'text' | 'email' | 'number' | 'password'
        value: dto.value, // string | undefined
        // (sin min/max)
      };
      return new TextboxQuestion(cfg);
    }
  }

  private mapDropdown(dto: DropdownDTO): DropdownQuestion {
    if (dto.options && dto.options.length) {
      return new DropdownQuestion({
        key: dto.key,
        label: dto.label,
        order: dto.order,
        required: dto.required,
        optionsLoader: () => of(dto.options!),
      });
    }

    // optionsUrl: construye optionsLoader con HttpClient
    const url = dto.optionsUrl!;
    const keyField = dto.keyField ?? 'id';
    const valueField = dto.valueField ?? 'name';

    return new DropdownQuestion({
      key: dto.key,
      label: dto.label,
      order: dto.order,
      required: dto.required,
      optionsLoader: () =>
        this.http.get<any[]>(url).pipe(
          map((arr) =>
            arr.map<Option>((it) => ({
              key: String(it[keyField]),
              value: String(it[valueField]),
            }))
          )
        ),
    });
  }

  private mapGroup(dto: GroupDTO): GroupQuestion {
    return {
      controlType: 'group',
      key: dto.key,
      label: dto.label,
      required: dto.required ?? false,
      order: dto.order ?? 1, // ✅ valor por defecto (evita number | undefined)
      children: this.mapDTOs(dto.children), // ✅ AnyQuestion[]
    };
  }

  private mapArray(dto: ArrayDTO): ArrayQuestion {
    return {
      controlType: 'array',
      key: dto.key,
      label: dto.label,
      order: dto.order ?? 0,
      required: dto.required ?? false,
      itemQuestions: this.mapDTOs(dto.itemQuestions),
      // Usamos initialItems como "n elementos vacíos" si initialCount > 0
      initialItems: dto.initialCount ? Array.from({ length: dto.initialCount }) : undefined,
    };
  }
}
