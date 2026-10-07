import { FormControl } from '@angular/forms';
import { Entity, SapFilter } from '@toch/sap-utils';

/** Makes the given fields of `T` required and non-null. */
export type WithRequiredFields<T, Fields extends keyof T> = T & {
  [Field in Fields]-?: Exclude<T[Field], null>;
};

/** Plain header map accepted by the base services. */
export type RequestHeaders = Record<string, string | string[]>;

/** Splits a string-literal type `T` by separator `K` into a tuple of segments. */
export type Split<T extends string, K extends string> = string extends T
  ? string[]
  : T extends ''
  ? []
  : T extends `${infer S}${K}${infer U}`
  ? [S, ...Split<U, K>]
  : [T];

/** SAP OData single-entity response envelope. */
export type EntityResult<T> = { d: T };

/** SAP OData entity-set response envelope. */
export type EntitySetResult<T> = { d: { results: T[]; __count?: string } };

/** Options for a SAP OData GET (entity, set, or count). */
export type SapGetEntitySetRequestOptions<T extends Entity> = {
  expand?: string[];
  filters?: SapFilter<T>[];
  params?: Record<string, any>;
  headers?: RequestHeaders;
};

/** Severity of a SAP message. Mirrors MessageType from @toch/sap-utils (a bare string union). */
export enum MessageSeverity {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

/** Maps a plain value shape `T` to the typed `FormControl` group that backs it. */
export type ControlsOf<T> = {
  [Field in keyof T]: FormControl<T[Field]>;
};
