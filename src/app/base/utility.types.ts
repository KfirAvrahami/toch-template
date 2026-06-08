export type WithRequiredFields<T, Fields extends keyof T> = T & { [Field in Fields]-?: Exclude<T[Field], null>}
export type RequestHeaders = Record<string, string | string[]>;
export type Split<T extends string, K extends string> = string extends T ?string[] : T extends '' ? []: T extends `${infer S}${K}${infer U}` ? [S, ...Split<U, K>] : [T];