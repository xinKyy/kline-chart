"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoolean = exports.isDayjs = exports.isWindow = exports.isExist = exports.isEmptyReactNode = exports.isEmptyObject = exports.isFunction = exports.isNullOrUndefined = exports.isNull = exports.isUndefined = exports.isColor = exports.isBlob = exports.isFile = exports.isRegExp = exports.isNumber = exports.isString = exports.isObject = exports.isArray = void 0;
var opt = Object.prototype.toString;
function isArray(obj) {
    return opt.call(obj) === '[object Array]';
}
exports.isArray = isArray;
function isObject(obj) {
    return opt.call(obj) === '[object Object]';
}
exports.isObject = isObject;
function isString(obj) {
    return opt.call(obj) === '[object String]';
}
exports.isString = isString;
function isNumber(obj) {
    return opt.call(obj) === '[object Number]' && obj === obj; // eslint-disable-line
}
exports.isNumber = isNumber;
function isRegExp(obj) {
    return opt.call(obj) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isFile(obj) {
    return opt.call(obj) === '[object File]';
}
exports.isFile = isFile;
function isBlob(obj) {
    return opt.call(obj) === '[object Blob]';
}
exports.isBlob = isBlob;
function isHex(color) {
    return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
}
function isRgb(color) {
    return /^rgb\((\s*\d+\s*,?){3}\)$/.test(color);
}
function isRgba(color) {
    return /^rgba\((\s*\d+\s*,\s*){3}\s*\d(\.\d+)?\s*\)$/.test(color);
}
function isColor(color) {
    return isHex(color) || isRgb(color) || isRgba(color);
}
exports.isColor = isColor;
function isUndefined(obj) {
    return obj === undefined;
}
exports.isUndefined = isUndefined;
function isNull(obj) {
    return obj === null;
}
exports.isNull = isNull;
function isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isFunction(obj) {
    return typeof obj === 'function';
}
exports.isFunction = isFunction;
function isEmptyObject(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}
exports.isEmptyObject = isEmptyObject;
function isEmptyReactNode(content, trim) {
    if (content === null || content === undefined || content === false) {
        return true;
    }
    if (typeof content === 'string' && (trim ? content.trim() === '' : content === '')) {
        return true;
    }
    return false;
}
exports.isEmptyReactNode = isEmptyReactNode;
function isExist(obj) {
    return obj || obj === 0;
}
exports.isExist = isExist;
function isWindow(el) {
    return el === window;
}
exports.isWindow = isWindow;
function isDayjs(time) {
    // dayjs.isDayjs 在实际应用场景，比如多个版本的 dayjs 会失效
    return (isObject(time) &&
        (('$y' in time &&
            '$M' in time &&
            '$D' in time &&
            '$d' in time &&
            '$H' in time &&
            '$m' in time &&
            '$s' in time) ||
            time._isAMomentObject) // 兼容 moment 的验证
    );
}
exports.isDayjs = isDayjs;
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
