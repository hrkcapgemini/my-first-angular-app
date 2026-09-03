import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api-endpoints';
import { environment } from '../../environments/environment';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  constructor(private http1: HttpClient){}

  /* Using Signal */
  private readonly http = inject(HttpClient);

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${environment.apiBaseUrl}${API_ENDPOINTS.TODOS}`);
  }

  /* Using RxJS */
   getTodosRxJs(): Observable<Todo[]> {
    return this.http1.get<Todo[]>('${environment.apiBaseUrl}${API_ENDPOINTS.TODOS}')
   }
}
