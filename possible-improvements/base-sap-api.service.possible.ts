import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { environment } from '../core/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { parseSapFilterString, Entity, SapFilter } from '@toch/sap-utils';
import { RequestHeaders } from './utility.types';

type EntityResult<T> = { d: T };
type EntitySetResult<T> = { d: { results: T[]; __count?: string } };

type GetEntityOptions<T extends Entity> = {
  expand?: string[];
  filters?: SapFilter<T>[];
  params?: Record<string, string>;
  headers?: HttpHeaders;
};

@Injectable()
export abstract class BaseSapApiService extends BaseApiService {

  //TODO: Replace 'ZTEMP_SRV' with the real OData service name after transfer — see AFTER_TRANSFER.md §4
  protected readonly service = 'ZTEMP_SRV';
  protected readonly rootApiPath = environment.api;

  constructor(protected override readonly _http: HttpClient) {
    super(_http);
  }

  /**
   * Fetches a single OData entity by URL.
   * Adds sap-language header and optional $filter / $expand params.
   */
  protected getEntity<T extends Entity = never>(
    url: string,
    options?: GetEntityOptions<T>
  ): Observable<EntityResult<T>> {
    const params: Record<string, string> = { ...(options?.params ?? {}), 'sap-language': 'he' };
    const filterString = parseSapFilterString(options?.filters);

    if (filterString.length > 0) {
      params['$filter'] = filterString;
    }

    if (options?.expand !== undefined && options.expand.length > 0) {
      params['$expand'] = options.expand.join(',');
    }

    return this._http.get<EntityResult<T>>(`${this.rootApiPath}/${url}`, {
      observe: 'response',
      params,
      headers: { ...(options?.headers ?? {}) }
    }).pipe(
      first(),
      map(response => {
        this.assertResponseHasBody(response);
        return response.body as EntityResult<T>;
      })
    );
  }

  /**
   * Fetches an OData entity set (collection) by URL.
   * Adds sap-language header and optional $filter / $expand params.
   */
  protected getEntitySet<T extends Entity = never>(
    url: string,
    options?: GetEntityOptions<T>
  ): Observable<EntitySetResult<T>> {
    const filterString = parseSapFilterString(options?.filters);
    const params: Record<string, string> = { ...(options?.params ?? {}), 'sap-language': 'he' };

    if (filterString.length > 0) {
      params['$filter'] = filterString;
    }

    if (options?.expand !== undefined && options.expand.length > 0) {
      params['$expand'] = options.expand.join(',');
    }

    return this._http.get<EntitySetResult<T>>(`${this.rootApiPath}/${url}`, {
      observe: 'response',
      params,
      headers: { ...(options?.headers ?? {}) }
    }).pipe(
      first(),
      map(response => {
        this.assertResponseHasBody(response);
        return response.body as EntitySetResult<T>;
      })
    );
  }

  /**
   * Creates an OData entity via POST.
   * Concrete subclasses must implement the full request using _request() or _http directly.
   */
  protected createEntity<T extends Record<string, unknown>>(
    url: string,
    entityData: Partial<T>,
    headers: RequestHeaders = {}
  ): Observable<EntityResult<T>> {
    return this._http.post<EntityResult<T>>(
      `${this.rootApiPath}/${url}`,
      entityData,
      { headers }
    );
  }
}
