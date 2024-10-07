'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Decimal = require('decimal.js');
var lodash = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Decimal__default = /*#__PURE__*/_interopDefaultLegacy(Decimal);

/**
 * 设置精度位 - 最大有效字位数
 * @param val
 */
function setPrecision(val) {
    Decimal__default["default"].set({ precision: val });
}
/**
 * 将安全金额的字符串还原回原始数字字符串，方便和后续的 decimal 计算
 * @param safeCurrency 安全金额的字符串
 * @returns 去除掉其他符号的数字字符串
 */
function getSafeCurrency(safeCurrency) {
    if (!safeCurrency) {
        return '0';
    }
    if (lodash.isString(safeCurrency)) {
        if (safeCurrency === '--') {
            return '0';
        }
        if (isNaN(Number(safeCurrency))) {
            return '0';
        }
    }
    return safeCurrency;
}
function getSafeCalcMethodDecimal(instance) {
    // 覆盖四个计算方法为获取安全值
    const methods = ['add', 'sub', 'mul', 'div'];
    methods.forEach(method => {
        instance[method] = function (val) {
            let decimalVal = getSafeDecimal(val);
            // 对于除法分母为 0 时返回 0
            if (method === 'div' && decimalVal.isZero()) {
                return getSafeCalcMethodDecimal(new Decimal__default["default"](0));
            }
            return getSafeCalcMethodDecimal(Decimal__default["default"][method](instance, decimalVal));
        };
    });
    return instance;
}
/** 将值安全转换为 Decimal 数据 */
function getSafeDecimal(value) {
    if (value instanceof Decimal__default["default"]) {
        return getSafeCalcMethodDecimal(value);
    }
    if (!value) {
        return getSafeCalcMethodDecimal(new Decimal__default["default"](0));
    }
    if (typeof value === 'string') {
        return getSafeCalcMethodDecimal(new Decimal__default["default"](getSafeCurrency(value)));
    }
    return getSafeCalcMethodDecimal(new Decimal__default["default"](value));
}
/**
 * 添加安全的计算工具
 */
const SafeCalcUtil = {
    mul(a, b) {
        return getSafeDecimal(a).mul(getSafeDecimal(b));
    },
    div(a, b) {
        return getSafeDecimal(a).div(getSafeDecimal(b));
    },
    add(a, b) {
        return getSafeDecimal(a).add(getSafeDecimal(b));
    },
    sub(a, b) {
        return getSafeDecimal(a).sub(getSafeDecimal(b));
    },
};
/**
 * 处理 '-0' '+0' 场景
 */
function formatZeroPrefix(value, digits) {
    digits = typeof digits === 'number' ? digits : getDigits(value);
    let _val = getSafeDecimal(value);
    const comparedZeroRes = _val.comparedTo(getSafeDecimal(0));
    if (comparedZeroRes === 0) {
        return `${_val.toFixed(digits)}`.replace(/[+-]*/, '');
    }
    return _val.toFixed(digits);
}
/**
 * 去掉小数点后面多余的 0
 * @param val
 */
const removeDecimalZero = (val) => {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/;
    val = `${val}`.replace(regexp, '$1');
    return val;
};
/**
 * 数字格式化 - 按照指定小数点位输出
 * @param data    要截取的数据
 * @param digits 指定小数点位数
 * @param isRound 是否向上约 | 传入具体 Decimal.Rounding 策略
 * @param delPostZero 是否去除末尾 0
 * @returns
 */
const formatNumberDecimal = (data, digits = 2, isRound, delPostZero) => {
    const round = lodash.isNumber(isRound) ? isRound : isRound ? Decimal__default["default"].ROUND_HALF_UP : Decimal__default["default"].ROUND_DOWN;
    let result = getSafeDecimal(formatZeroPrefix(getSafeDecimal(data).toFixed(digits, round), digits)).toFixed(digits, round);
    if (!delPostZero) {
        return result;
    }
    return removeDecimalZero(result);
};
/**
 * 将对象中的某个 key 进行约小数位
 */
function formatObjectNumberByKeys(obj, keys, offset) {
    keys.forEach(k => {
        if (obj[k]) {
            obj[k] = formatNumberDecimal(obj[k], offset, false, true);
        }
    });
    return obj;
}
/**
 * 资产金额格式化，三位加逗号
 * @param data         要格式化的数据
 * @param digits      保留几位小数
 * @param keepDigits 是否始终保持对应位数的小数，不足补 0
 * @returns
 */
const formatCurrency = (data, digits, keepDigits = true, isRound) => {
    if (!(data === null || data === void 0 ? void 0 : data.toString())) {
        return '';
    }
    if (!digits && digits !== 0) {
        digits = getDigits(data);
    }
    data = getSafeDecimal(data);
    let value = (keepDigits ? formatNumberDecimal(data, digits, isRound) : formatNumberDecimal(data, digits, isRound, true)).split('.');
    let n = value[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (value.length > 1) {
        n = `${n}.${value[1]}`;
    }
    return n;
};
/**
 * 获取某个数的小数位
 */
function getDigits(data) {
    var _a, _b;
    if (typeof data === 'string') {
        return ((_a = data.split('.')[1]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
    data = getSafeDecimal(data);
    return ((_b = data.toFixed().split('.')[1]) === null || _b === void 0 ? void 0 : _b.length) || 0;
}

exports.SafeCalcUtil = SafeCalcUtil;
exports.formatCurrency = formatCurrency;
exports.formatNumberDecimal = formatNumberDecimal;
exports.formatObjectNumberByKeys = formatObjectNumberByKeys;
exports.formatZeroPrefix = formatZeroPrefix;
exports.getDigits = getDigits;
exports.getSafeCurrency = getSafeCurrency;
exports.getSafeDecimal = getSafeDecimal;
exports.removeDecimalZero = removeDecimalZero;
exports.setPrecision = setPrecision;
