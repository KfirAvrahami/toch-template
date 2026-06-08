import * as sapUtilsModule from './dist/sap-odata/index.js';

const sapUtils = sapUtilsModule?.default ?? sapUtilsModule;

export const {
  parseDateForSAP,
  parseDateForSAPKey,
  parseDateOffsetForSAPKey,
  parseTimeForSAP,
  parseSAPTimestamp,
  parseSAPDate,
  parseSapFilterString,
  parseArrayToFilter,
  proccessSapSuccessMessage,
  proccessSapErrorMessage,
  arrayOps,
  valueOps,
  rangeOps,
  substrOps,
  objectOps,
  substrFuncs,
  formatSapFilter,
  formatSapMessage,
  isArrayFilter,
  isValueFilter,
  isRangeFilter,
  isSubstringFilter,
  isObjectFilter
} = sapUtils;

export default sapUtils;
