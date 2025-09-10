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
      <app-dynamic-form [questions]="questionsJson()" />
    </div>
  `,
})
export class App {
  private qs = inject(Question);

  questionsJson = toSignal(this.qs.getQuestionsFromJson('questions.json'), {
    initialValue: [],
  });
}
