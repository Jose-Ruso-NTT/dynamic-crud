import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicForm } from './dynamic-form/dynamic-form';
import { Question } from './question';
import { QuestionBase } from './question-base';

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
  styleUrl: './app.css',
})
export class App {
  questions$: Observable<QuestionBase<string>[]> = inject(Question).getQuestions();
}
