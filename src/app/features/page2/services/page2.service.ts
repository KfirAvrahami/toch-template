import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGE2_API_PROVIDER } from '../adapters/interface';
import { Page2AdapterResult } from '../types';

@Injectable()
export class Page2Service {
  private readonly activeAdapter = inject(PAGE2_API_PROVIDER);

  getData(): Observable<Page2AdapterResult> {
    return this.activeAdapter.getData();
  }
}
