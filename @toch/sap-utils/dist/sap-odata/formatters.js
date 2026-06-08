"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSapMessage = exports.formatSapFilter = void 0;
const parser_1 = require("./parser");
const types_1 = require("./types");
const utils_1 = require("./utils");
// TODO: fix only the typos, dont change anything else
function formatFilterValue(value, datetimeoffset = false) {
    switch (typeof value) {
        case 'string':
            return `'${value}'`;
        case 'boolean':
        case 'number':
            return `'${value}'`;
        case 'object':
            if (value instanceof Date) {
                return (datetimeoffset? (0, parser_1.parseDateOffsetForSAPKey)(value) :
            (0, parser_1.parseDateForSAPKey)(value));
            }
            break;
    }
    return '';
}

function formatSapFilter(filter) {
    if(filter == null) return '';

    else if ((0, utils_1.isArrayFilter)(filter) && filter.filters.length > 0) {
        // Ignores empty filters
        const and = ` ${filter.and ? "and" : "or"} `;
        return `(${filter.filters.map(formatSapFilter).filter(f => f !== "").join(and)})`;
    } else if ((0, utils_1.isRangeFilter)(filter)) {
        return `${filter.op === "nb" ? "not " : ""}(${String(filter.path)} ge ${formatFilterValue(filter.low, filter.valueIsDatetimeOffset)} and ${String(filter.path)} le ${formatFilterValue(filter.high, filter.valueIsDatetimeOffset)})`;
    } else if ((0, utils_1.isValueFilter)(filter)) {
        return `(${String(filter.path)} ${filter.op} ${formatFilterValue(filter.value, filter.valueIsDatetimeOffset)})`;
    } else if ((0, utils_1.isSubstringFilter)(filter)) {
         const func = types_1.substrFuncs[filter.op];
         return `(${filter.not ? "not " : ""}${func}('${filter.value}',${String(filter.path)}))`;
    } else {
        return '';
    }   
}

exports.formatSapFilter = formatSapFilter;

function formatSapMessage(_message) {
    const { code, message, severity } = _message;
    return { code, message, severity };
}

exports.formatSapMessage = formatSapMessage;