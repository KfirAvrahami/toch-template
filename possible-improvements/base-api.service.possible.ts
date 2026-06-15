import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../core/environments/environment';
import { WithRequiredFields } from './utility.types';

export type HttpMethod = 'GET' | 'POST';
export type RequestOptions<TPayload> = {
  method?: HttpMethod;
  headers?: HttpHeaders;
  params?: HttpParams;
  data?: TPayload;
};

@Injectable()
export abstract class BaseApiService {
  private readonly apiBaseUrl = environment.api;

  constructor(protected readonly _http: HttpClient){}

  assertResponseHasBody<T extends HttpResponse<unknown>>(response: T): asserts response is WithRequiredFields<T, 'body'> {
    if (response.body == null) {
      // SAP exception: body nullability is an OData/HTTP contract concern, not application logic.
      throw new Error('Response body is empty');
    }
  }

  protected _request<TResponse, TPayload = Record<string, never>>(
    path: string,
    options?: RequestOptions<TPayload>
  ): Observable<TResponse> {
    const normalizedMethod = options?.method ?? 'GET';
    const normalizedHeaders = options?.headers ?? new HttpHeaders();
    const normalizedParams = options?.params ?? new HttpParams();
    const url = this.resolveUrl(path);

    if (normalizedMethod === 'GET' && options?.data == null) {
      return this._http.get<TResponse>(url, {
        params: normalizedParams,
        headers: normalizedHeaders
      });
    }

    return this._http.post<TResponse>(url, options?.data ?? ({} as TPayload), {
      params: normalizedParams,
      headers: normalizedHeaders
    });
  }

  protected _requestAsync<TResponse, TPayload = Record<string, never>>(
    path: string,
    options?: RequestOptions<TPayload>
  ): Promise<TResponse> {
    return firstValueFrom(this._request<TResponse, TPayload>(path, options));
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
