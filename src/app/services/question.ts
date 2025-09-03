import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { QuestionBase } from '../models/question-base';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';
import { Option } from '../models/types';

@Injectable()
export class Question {
  constructor(private http: HttpClient) {}

  // TODO: get from a remote source of question metadata

  getQuestions(): Observable<QuestionBase<string>[]> {
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
        of([
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

    const questions: QuestionBase<string>[] = [q1, q2, q3];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}
