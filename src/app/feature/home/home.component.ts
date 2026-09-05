import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TodoService, type Todo } from '../../services/todo.service';
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { HeaderComponent } from '../header/header.component';
import { Hilighted } from  '../../shared/directives/hilighted'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SearchPipe, Hilighted],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);

  user = this.authService.getCurrentUser();

  readonly todos = signal<Todo[]>([]);
  readonly searchQuery = signal('');
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalTodos = computed(() => this.todos().length);
  readonly completedTodos = computed(() => this.todos().filter((todo) => todo.completed).length);
  readonly pendingTodos = computed(() => this.todos().filter((todo) => !todo.completed).length);

  // todosRxJs: any;
  // todosRxJsCompleted: any;
  // todosRxJsPending: any;

  constructor(  private todoService1: TodoService) {
    /*effect start *
    effect(() => {
      const data = this.todos();
      const loading = this.isLoading();
      const errorMessage = this.error();

      if (!loading && data.length > 0) {
        console.log('Dashboard summary:', {
          total: this.totalTodos(),
          completed: this.completedTodos(),
          pending: this.pendingTodos(),
        });
      }

      if (errorMessage) {
        console.error('Dashboard error:', errorMessage);
      }
    });
  / * Effect ends */
  
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.todoService.getTodos().subscribe({
      next: (response) => {
        this.todos.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Unable to load dashboard data.');
        this.isLoading.set(false);
      },
    });
  }

  /*usin RxJS */
  // loadTodosRxJs(){
  //   this.isLoading.set(true);
  //   this.todoService1.getTodosRxJs().subscribe( (response:any) => {
  //     console.log('Todos from RxJS:', response);
  //     this.todosRxJs = response;
  //     this.todosRxJsCompleted = response.filter((todo:any) => todo.completed).length;
  //     this.todosRxJsPending = response.filter((todo:any) => !todo.completed).length;
  //     this.isLoading.set(false);
  //   })
  // }
}
