import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PAGE2_MOCK_PAYLOAD } from '../../page2-mock.data';
import { Page2Adapter, Page2AdapterResult } from '../../types';

@Injectable()
export class Page2MockAdapter implements Page2Adapter {
  getData(): Observable<Page2AdapterResult> {
    return of({
      adapter: 'mock',
      title: $localize`:@@page2.mock.title:Mock adapter response`,
      subtitle: $localize`:@@page2.mock.subtitle:Local hardcoded payload`,
      payload: PAGE2_MOCK_PAYLOAD
    });
  }
}
