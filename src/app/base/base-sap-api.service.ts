import {
  HttpClient,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entity, SapFilter, parseSapFilterString } from '@toch/sap-utils';
import { filter, first, map, switchMap, tap } from 'rxjs';
import { environment } from '../core/environments/environment';
import { BaseApiService } from './base-api.service';
import { GenericError } from './base.error';
import {
  EntityResult,
  EntitySetResult,
  RequestHeaders,
  SapGetEntitySetRequestOptions,
} from './utility.types';

/**
 * Abstract base for SAP OData services. A concrete service sets `service` to its SAP OData service
 * name and extends this class; a feature's `adapter.sap.ts` then calls the protected helpers.
 * Every request sends `sap-language: 'he'`. Reads assert a non-null body. Writes
 * (create/patch/delete/upload) fetch a fresh CSRF token first and keep `body` nullable, since SAP
 * may answer 201/204 with no body.
 */
@Injectable()
export abstract class BaseSapApiService extends BaseApiService {
  /** SAP OData service name — override in each concrete service (placeholder here). */
  protected readonly service = 'ZTEMP_SRV';
  protected readonly _root = environment.api;

  constructor(protected override readonly _http: HttpClient) {
    super(_http);
  }

  /** GET a single entity. */
  protected getEntity<T extends Entity = never>(
    url: string,
    options?: SapGetEntitySetRequestOptions<T>
  ) {
    return this._http
      .get<EntityResult<T>>(`${this._root}/${url}`, {
        observe: 'response',
        params: this.buildParams(options),
        headers: { ...(options?.headers ?? {}) },
      })
      .pipe(
        first(),
        map((response) => {
          this.assertResponseHasBody(response);
          return response;
        })
      );
  }

  /** GET an entity set (collection). */
  protected getEntitySet<T extends Entity = never, K = T>(
    url: string,
    options?: SapGetEntitySetRequestOptions<T>
  ) {
    return this._http
      .get<EntitySetResult<K>>(`${this._root}/${url}`, {
        observe: 'response',
        params: this.buildParams(options),
        headers: { ...(options?.headers ?? {}) },
      })
      .pipe(
        first(),
        map((response) => {
          this.assertResponseHasBody(response);
          return response;
        })
      );
  }

  /** GET the `$count` of an entity set. */
  protected getEntitySetCount<T extends Entity = never>(
    url: string,
    options?: SapGetEntitySetRequestOptions<T>
  ) {
    return this._http
      .get<number>(`${this._root}/${url}/$count`, {
        observe: 'response',
        params: this.buildParams(options),
        headers: { ...(options?.headers ?? {}) },
      })
      .pipe(
        first(),
        map((response) => {
          this.assertResponseHasBody(response);
          return response;
        })
      );
  }

  /** POST a new entity (CSRF-protected). */
  protected createEntity<T extends Record<string, any>>(
    url: string,
    data: Partial<T>,
    headers: RequestHeaders = {}
  ) {
    return this.getXcsrfToken().pipe(
      switchMap((token) =>
        this._http.post<EntityResult<T>>(`${this._root}/${url}`, data, {
          observe: 'response',
          headers: this.writeHeaders(token, headers),
        })
      ),
      first()
    );
  }

  /** PATCH (update) an entity (CSRF-protected). */
  protected patchEntity<T extends Record<string, any>>(
    url: string,
    data: Partial<T>,
    headers: RequestHeaders = {}
  ) {
    return this.getXcsrfToken().pipe(
      switchMap((token) =>
        this._http.patch<EntityResult<T>>(`${this._root}/${url}`, data, {
          observe: 'response',
          headers: this.writeHeaders(token, headers),
        })
      ),
      first()
    );
  }

  /** DELETE an entity (CSRF-protected). */
  protected deleteEntity<T extends Record<string, any>>(
    url: string,
    headers: RequestHeaders = {}
  ) {
    return this.getXcsrfToken().pipe(
      switchMap((token) =>
        this._http.delete<EntityResult<T>>(`${this._root}/${url}`, {
          observe: 'response',
          headers: this.writeHeaders(token, headers),
        })
      ),
      first()
    );
  }

  /**
   * Uploads a file to a media-stream entity, reporting upload progress.
   * @param slug data that links the file to the right entity.
   * @param onUploadProgress called on each `HttpEventType.UploadProgress` event.
   */
  protected uploadFile<T extends Record<string, any>>(
    url: string,
    file: File,
    slug: string,
    headers: RequestHeaders = {},
    onUploadProgress?: (event: HttpProgressEvent) => void
  ) {
    return this.getXcsrfToken().pipe(
      switchMap((token) =>
        this._http.post<EntityResult<T>>(`${this._root}/${url}`, file, {
          observe: 'events',
          reportProgress: true,
          headers: {
            ...headers,
            'sap-language': 'he',
            'x-csrf-token': token,
            // SAP media streams take the raw bytes typed as the file itself (not multipart).
            'Content-Type': file.type || 'application/octet-stream',
            accept: 'application/json',
            slug: `${encodeURIComponent(file.name)}|${file.type}|${Date.now()}|${slug}`,
          },
        })
      ),
      tap((event) => {
        if (event.type === HttpEventType.UploadProgress && onUploadProgress) {
          onUploadProgress(event);
        }
      }),
      filter(
        (event): event is HttpResponse<EntityResult<T>> => event.type === HttpEventType.Response
      ),
      first()
    );
  }

  /** Fetches a fresh CSRF token from the service `$metadata`. */
  protected getXcsrfToken() {
    const url = `${this._root}/${this.service}/$metadata`;
    return this._http
      .get(url, {
        observe: 'response',
        responseType: 'text',
        headers: { 'X-CSRF-Token': 'Fetch' },
      })
      .pipe(
        map((response) => {
          const token = response.headers.get('x-csrf-token');
          if (token === null) {
            throw new GenericError(
              `Failed to fetch CSRF token: ${response.status} ${response.statusText}`
            );
          }
          return token;
        })
      );
  }

  /** Builds an OData entity URL: `<service>/<entity>`. */
  protected url(entityName: string, serviceName: string = this.service): string {
    return `${serviceName}/${entityName}`;
  }

  /** Builds the OData query params from the request options. */
  private buildParams<T extends Entity>(
    options?: SapGetEntitySetRequestOptions<T>
  ): Record<string, any> {
    const params: Record<string, any> = { ...(options?.params ?? {}), 'sap-language': 'he' };
    const filters = parseSapFilterString(options?.filters);
    if (filters.length > 0) {
      params['$filter'] = filters;
    }
    if (options?.expand != undefined && options.expand.length > 0) {
      params['$expand'] = options.expand.join(',');
    }
    return params;
  }

  /** Shared headers for CSRF-protected writes. */
  private writeHeaders(token: string, headers: RequestHeaders): RequestHeaders {
    return {
      'sap-language': 'he',
      'x-csrf-token': token,
      accept: 'application/json',
      'content-type': 'application/json',
      ...headers,
    };
  }
}
