import type { Entity, SapFilter, SapFilterArray, SapMessage, SapValueTypes, Nullish, Message } from "./types";
export function parseDateForSAP(timestamp: Date | number): string;
export function parseDateForSAP(timestamp: Nullish): null;
export function parseDateForSAP(timestamp: Nullish<Date | number>): string | null;
export function parseDateForSAPKey(timestamp: Date | number): string;
export function parseDateForSAPKey(timestamp: Nullish): null;
export function parseDateForSAPKey(timestamp: Nullish<Date | number>): string | null;
export function parseDateOffsetForSAPKey(timestamp: Date | number ): string;
export function parseDateOffsetForSAPKey(timestamp: Nullish):| null;
export function parseDateOffsetForSAPKey(timestamp: Nullish<number | Date>): string | null;
export function parseTimeForSAP(time: Date | string): string ;
export function parseTimeForSAP(time: Nullish): null;
export function parseSAPTimestamp(date: string | null | undefined): number;
export function parseSAPDate(date: string ): Date;
export function parseSAPDate(date: Nullish): null;
export function parseSAPDate(date: Nullish<string>): Date | null;
export function parseSapFilterString(
  filters: Nullish<SapFilter<T> | SapFilter<T>[]>
): string;
export function parseArrayToFilter<T extends Entity = never>(
  values: SapValueTypes[],
  path: keyof T,
  op?: SapFilterValue["op"],
  and?: boolean
): SapFilterArray<T> | null;
export function proccessSapSuccessMessage(headers: any): Message[];
export function proccessSapErrorMessage(error: any): Message[];
