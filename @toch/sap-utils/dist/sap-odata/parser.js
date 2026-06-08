"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proccessSapErrorMessage = exports.proccessSapSuccessMessage = exports.parseArrayToFilter = exports.parseSapFilterString = exports.parseSAPDate = exports.parseSAPTimestamp = exports.parseTimeForSAP = exports.parseDateOffsetForSAPKey = exports.parseDateForSAPKey = exports.parseDateForSAP = void 0;
const formatters_1 = require("./formatters");
// TODO: fix only the typos, dont change anything else
function parseDateForSAP(timestamp) {
    if(timestamp == null || timestamp == undefined) return null;
    return `\/Date(${timestamp instanceof Date ? timestamp.getTime() : timestamp})\/`;
}
exports.parseDateForSAP = parseDateForSAP;
function parseDateForSAPKey(timestamp) {
    if(timestamp == null || timestamp == undefined) return null;
    const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return `datetime'${dateObj.toISOString().split(".")[0]}'`;
}
exports.parseDateForSAPKey = parseDateForSAPKey;
function parseDateOffsetForSAPKey(timestamp) {
    if(timestamp == null || timestamp == undefined) return null;
    const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const dateTimePattern = /GMT([-,+,\d]{4,5})/;
    const match = dateObj.toString().match(dateTimePattern);
    return match && match[1] ? `datetimeoffset'${dateObj.toISOString().split(".")[0]}${match[1]}'` : parseDateForSAPKey(dateObj);
}
exports.parseDateOffsetForSAPKey = parseDateOffsetForSAPKey;
function parseTimeForSAP(time) {
    if(time == null || time == undefined) return null;
    var timeParts;
    if(typeof time == "string") {
        if (time.includes(".")) {
            time = time.split(".")[0];
        } 
        if (time.includes("T")) {
            time = time.split("T")[1];
        }
        if (time.includes(":")) {
            time = time.split(":")[1];
        }
        timeParts = time.split(":");
        if (timeParts.length != 3) {
            return null;
        }
    } else {
        timeParts = time.toLocaleTimeString().split(":");
    }
    return `PT${timeParts[0]}H${timeParts[1]}M${timeParts[2]}S`;
}
exports.parseTimeForSAP = parseTimeForSAP;

function parseSAPTimestamp(date) {
   // original: const dateTimePattern = /\Date\((\d{13})\)\//;
   const dateTimePattern = /\/Date\((\d{13})\)\//;
   const match = date === null || date === void 0 ? void 0 : date.match(dateTimePattern);
   return match && match[1] ? parseInt(match[1]) : 0;
}
exports.parseSAPTimestamp = parseSAPTimestamp;

function parseSAPDate(date) {
  return date == null ? null : new Date(parseSAPTimestamp(date));
}
exports.parseSAPDate = parseSAPDate;

function parseSapFilterString(filter) {
   if (Array.isArray(filter) && filter.length > 0) {
    return (0, formatters_1.formatSapFilter)({
        op: "arr",
        and: true,
        // original: filters
        filters: filter
    });
 
    } else {
        return (0, formatters_1.formatSapFilter)(filter);
    }
    return "";
}
exports.parseSapFilterString = parseSapFilterString;

function parseArrayToFilter(values, path, op = "eq", and = false) {
    return values.length > 0 ? {
        op: "arr",
        and,
        filters: values.map(value => ({
            op,
            path,
            value
        }))
    } : null;
}
exports.parseArrayToFilter = parseArrayToFilter;


function proccessSapSuccessMessage(headers) {
    var _a;
    try {
        // original: const meessage = JSON.parse(headers.get("sap-message"));
        const message = JSON.parse(headers.get("sap-message"));
        // original: return message != null ? [(0, formatters_1.formatSapMessage)(message)].concat(((_a = message.details) === null || _a === void 0 ? void 0 : _a.map(m => (0, formatters_1.formatSapMessage)(m))) || [])
        return message != null ? [(0, formatters_1.formatSapMessage)(message)].concat(((_a = message.details) === null || _a === void 0 ? void 0 : _a.map(m => (0, formatters_1.formatSapMessage)(m))) || [])
        : [];
    } catch (ex) {
      throw ex;
    }
}
exports.proccessSapSuccessMessage = proccessSapSuccessMessage;

function proccessSapErrorMessage(message) {
    var _a, _b, _c, _d;
    const SAP_ERROR_CODE = "/IWBEP/CX_MGW_TECH_EXCEPTION";
    try {
        // original: const messages = (_d = (_c = (_b = (_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.innererror) === null || _c === void 0 ? void 0 : _c.errordetails) === null || _d === void 0 ? void 0 : _d.filter((err) => err.code !== SAP_ERROR_CODE);
        const messages = (_d = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.error) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.innererror) === null || _c === void 0 ? void 0 : _c.errordetails) === null || _d === void 0 ? void 0 : _d.filter((err) => err.code !== SAP_ERROR_CODE);
        return messages ? [...messages.map(m => (0, formatters_1.formatSapMessage)(m))] : [];
    } catch (ex) {
      throw ex;
    }
}
exports.proccessSapErrorMessage = proccessSapErrorMessage;

