import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { environment } from '../core/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { parseSapFilterString, Entity, SapFilter } from '@toch/sap-utils';
import { RequestHeaders } from './utility.types';


type EntityResult<T> = {d: T};
type EntitySetResult<T> = {d: {results: T[], __count?: string}};

@Injectable()
export abstract class BaseSapApiService extends BaseApiService {
 
  //TODO: transform the code i give you here to something that works
  protected readonly service = 'ZTEMP_SRV';
  protected readonly __root = environment.api;

  constructor(protected override readonly _http: HttpClient){
    super(_http);
  }

  protected getEntity<T extends Entity = never> (
    url: string,
    options?: {
      expand?: string[];
      filters?: SapFilter<T>[];
      params?: Record<string, any>;
      headers?: HttpHeaders;
    }
  ) {
    const params: Record<string, any> = {...(options?.params ?? {}), 'sap-langguage' : 'he'};
    const filters = parseSapFilterString(options?.filters);

    if(filters.length > 0) {
      params['$filter'] = filters;
    }

    if(options?.expand != undefined && options.expand.length > 0) {
      params['$expand'] = options.expand.join(',');
    }

    return this._http.get<EntityResult<T>>(`${this.__root}/${url}`, {
      observe: 'response',
      params: params,
      headers: { ...(options?.headers ?? {}) }
    }).pipe(
      first(),
      map( response => {
        this.assertResponseHasBody(response);
        return response;
      })
    )
  }

  protected getEntitySet<T extends Entity = never, K = T> (
    url: string,
    options?: {
      expand?: string[];
      filters?: SapFilter<T>[];
      params?: Record<string, any>;
      headers?: HttpHeaders;
    }
  ) {
    const filters = parseSapFilterString(options?.filters);
    const params: Record<string, any> = {...(options?.params ?? {}), 'sap-langguage' : 'he'};
    if(filters.length > 0) {
      params['$filter'] = filters;
    }

    if(options?.expand != undefined && options.expand.length > 0) {
      params['$expand'] = options.expand.join(',');
    }

    return this._http.get<EntitySetResult<T>>(`${this.__root}/${url}`, {
      observe: 'response',
      params: params,
      headers: { ...(options?.headers ?? {}) }
    }).pipe(
      first(),
      map( response => {
        this.assertResponseHasBody(response);
        return response;
      })
    )
  }
  
  protected createEntity<T extends Record<string, any>>(
    url: string,
    data: Partial<T>,
    headers: RequestHeaders = {}
  ): void {

  }

}
