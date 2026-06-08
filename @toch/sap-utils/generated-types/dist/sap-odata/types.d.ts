export const arrayOps: readonly ["arr"];
export const valueOps: readonly ["eq", "ne", "ge", "gt", "le", "lt"];
export const rangeOps: readonly ["bt", "nb"];
export const substrOps: readonly ["startswith", "endswith", "contains"];
export declare const substrFuncs: {
  [x in typeof substrOps[number]]: string;
};

export declare type SapValueTypes = string | number | Date | boolean;
export declare type Entity = Record<string, SapValueTypes | Entity[]>;
export declare type SapFilterArray<T extends Entity = never> = {
  filters: SapFilter<T>[];
  op: (typeof arrayOps)[number];
  and: boolean;
};
export declare type SapFilterValue<T extends Entity = never> = {
  path: keyof T;
  op: (typeof valueOps)[number];
  value: SapValueTypes;
  valueIsDatetimeOffset?: boolean;
};
export declare type SapFilterRange<T extends Entity = never> = {
  path: keyof T;
  op: (typeof rangeOps)[number];
  low: SapValueTypes;
  high: SapValueTypes;
  valueIsDatetimeOffset?: boolean;
};
export declare type SapFilterSubstring<T extends Entity = never> = {
  path: keyof T;
  op: (typeof rangeOps)[number];
  value: string;
  not?: boolean;
};
export declare type SapFilter<T extends Entity = never> =
  | SapFilterArray<T>
  | SapFilterArray<T>
  | SapFilterValue<T>
  | SapFilterSubstring<T>
  | SapFilterRange<T>;
export declare type MessageType = "success" | "error" | "info" | "warning";

export declare type message = {
  code: string;
  message: string;
  severity: MessageType;
};

export declare type SapMessage = {
  code: string;
  message: string;
  severity: string;
  details: SapMessage[];
  target: string;
  transition: boolean;
};
export declare type Nullish<T = never> = T | null | undefined;
