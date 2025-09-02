import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicForm } from './components/dynamic-form';
import { QuestionBase } from './models/question-base';
import { Question } from './services/question';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, DynamicForm],
  providers: [Question],
  template: `
    <div>
      <h2>Job Application for Heroes</h2>
      <app-dynamic-form [questions]="questions$ | async" />
    </div>
  `,
})
export class App {
  questions$: Observable<QuestionBase<string>[]> = inject(Question).getQuestions();
}
