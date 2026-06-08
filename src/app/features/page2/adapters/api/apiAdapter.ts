import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '../../../../base/base-api.service';
import { Page2Adapter, Page2AdapterResult } from '../../types';

type JsonPlaceholderTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

@Injectable()
export class Page2ApiAdapter extends BaseApiService implements Page2Adapter {
  getData(): Observable<Page2AdapterResult> {
    return this._request<JsonPlaceholderTodo>('https://jsonplaceholder.typicode.com/todos/1').pipe(
      map((response) => ({
        adapter: 'api' as const,
        title: response.title,
        subtitle: $localize`:@@page2.api.subtitle:item id ${response.id}:itemId: | completed: ${response.completed}:completed:`,
        payload: response
      }))
    );
  }
}
