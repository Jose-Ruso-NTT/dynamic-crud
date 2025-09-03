import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DynamicForm } from './components/dynamic-form';
import { Question } from './services/question';

@Component({
  selector: 'app-root',
  imports: [DynamicForm],
  providers: [Question],
  template: `
    <div>
      <h2>DynamicForm</h2>
      <app-dynamic-form [questions]="questions()" />
    </div>
  `,
})
export class App {
  questions = toSignal(inject(Question).getQuestions(), { initialValue: [] });
}
