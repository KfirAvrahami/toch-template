import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../core/environments/environment';
import { WithRequiredFields } from './utility.types';

export type HttpMethod = 'GET' | 'POST';
export type RequestOptions<P> = {
  method?: HttpMethod;
  headers?: HttpHeaders;
  params?: HttpParams;
  data?: P;
};

@Injectable()
export abstract class BaseApiService {
  private readonly apiBaseUrl = environment.api;

  constructor(protected readonly _http: HttpClient){}

  assertResponseHasBody<T extends HttpResponse<any>>(response:T): asserts response is WithRequiredFields<T, 'body'> {
    if(response.body == null) {
      throw new Error();
    }
  }
  
  protected _request<R, P = {}>(path: string, options?: RequestOptions<P>): Observable<R> {
    const normalizedOptions: Required<Omit<RequestOptions<P>, 'data'>> & Pick<RequestOptions<P>, 'data'> = {
      method: options?.method ?? 'GET',
      headers: options?.headers ?? new HttpHeaders(),
      params: options?.params ?? new HttpParams(),
      data: options?.data
    };
    const url = this.resolveUrl(path);
    let request$: Observable<R>;

    if (normalizedOptions.method === 'GET' && normalizedOptions.data == null) {
      request$ = this._http.get<R>(url, {
        params: normalizedOptions.params,
        headers: normalizedOptions.headers
      });
    } else {
      request$ = this._http.post<R>(url, normalizedOptions.data ?? ({} as P), {
        params: normalizedOptions.params,
        headers: normalizedOptions.headers
      });
    }

    return request$;
  }

  protected _requestAsync<R, P = {}>(
    path: string,
    options?: RequestOptions<P>
  ): Promise<R> {
    return firstValueFrom(this._request<R, P>(path, options));
  }

  //TODO: return to ${environment.api}${path}
  private resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const base = this.apiBaseUrl.endsWith('/') ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }
}
