import type {
  Entity,
  SapFilter,
  SapFilterArray,
  SapFilterValue,
  SapFilterRange,
  SapFilterSubstring
} from "./types";
export function isArrayFilter<T extends Entity = never>(val: SapFilter<T>): val is SapFilterArray<T>;
export function isValueFilter<T extends Entity = never>(val: SapFilter<T>): val is SapFilterValue<T>;
export function isRangeFilter<T extends Entity = never>(val: SapFilter<T>): val is SapFilterRange<T>;
export function isSubstringFilter<T extends Entity = never>(val: SapFilter<T>): val is SapFilterSubstring<T>;
