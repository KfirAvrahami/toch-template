"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectFilter = exports.isSubstringFilter = exports.isRangeFilter = exports.isValueFilter = exports.isArrayFilter = void 0;
const types_1 = require("./types");
function isArrayFilter(val) {
    return types_1.arrayOps.includes(val.op);
}
exports.isArrayFilter = isArrayFilter;
function isValueFilter(val) {
    return types_1.valueOps.includes(val.op);
}
exports.isValueFilter = isValueFilter;
function isRangeFilter(val) {
    return types_1.rangeOps.includes(val.op);
}
exports.isRangeFilter = isRangeFilter;
function isSubstringFilter(val) {
    return types_1.substrOps.includes(val.op);
}
exports.isSubstringFilter = isSubstringFilter;
function isObjectFilter(val) {
    return types_1.objectOps.includes(val.op);
}
exports.isObjectFilter = isObjectFilter;