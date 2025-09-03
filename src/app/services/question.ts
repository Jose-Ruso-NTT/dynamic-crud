// services/question.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AnyQuestion, ArrayQuestion } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';
import { Option } from '../models/types';

@Injectable({ providedIn: 'root' })
export class Question {
  constructor(private http: HttpClient) {}

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
}
