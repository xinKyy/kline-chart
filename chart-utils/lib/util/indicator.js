'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dayjs = require('dayjs');
var isBetween = require('dayjs/plugin/isBetween');
var index = require('../type/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
var isBetween__default = /*#__PURE__*/_interopDefaultLegacy(isBetween);

dayjs__default["default"].extend(isBetween__default["default"]);
/**
 * 计算 SMA
 */
const calculateSMA = (data, count, price, priceOffset) => {
    let result = [];
    let avg = data => {
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
            sum += data[i]?.[price];
        }
        return sum / data.length;
    };
    for (let i = count - 1, len = data.length; i < len; i += 1) {
        let val = avg(data.slice(i - count + 1, i + 1));
        if (i - count + 1 === 0) {
            for (let j = 0; j < count; j += 1) {
                result.push({ time: data[j]?.time, value: Number(val.toFixed(priceOffset)) });
            }
        }
        else {
            result.push({ time: data[i]?.time, value: Number(val.toFixed(priceOffset)) });
        }
    }
    return result;
};
/**
 * 计算EMA
 * // ema 上一日
 * // price 价格,dif
 * // period 日期
 */
const calculateEMA = (ema, price, period) => {
    return (2 * price + (period - 1) * ema) / (period + 1);
};
/**
 * 计算 MACD
 * fast 快线
 * slow 慢线
 * signal 日期
 */
const calculateMACD = (data, fast, slow, signal, priceOffset) => {
    const newData = [];
    data.forEach((item, index) => {
        let emaFast = 0;
        let emaSlow = 0;
        let dea = 0;
        let dif = 0;
        if (index < fast - 1) {
            emaFast = 0;
        }
        else {
            emaFast = calculateEMA(newData[index - 1]?.emaFast || 0, item.close, fast);
        }
        if (index < slow - 1) {
            emaSlow = 0;
        }
        else {
            emaSlow = calculateEMA(newData[index - 1]?.emaSlow || 0, item.close, slow);
        }
        dif = emaFast - emaSlow;
        if (index < signal - 1) {
            dea = 0;
        }
        else {
            dea = calculateEMA(newData[index - 1]?.dea || 0, dif, signal);
        }
        newData.push({
            emaFast: Number(emaFast.toFixed(priceOffset)),
            emaSlow: Number(emaSlow.toFixed(priceOffset)),
            dif: Number(dif.toFixed(priceOffset)),
            dea: Number(dea.toFixed(priceOffset)),
            value: Number(((dif - dea) * 2).toFixed(priceOffset)),
            time: item.time,
        });
    });
    return newData;
};
const updateTimeOfData = (value, type, kLineChartData) => {
    const timeList = kLineChartData.map((item, index) => {
        return {
            index,
            time: dayjs__default["default"](item.time).format('YYYY-MM-DD HH:mm'),
        };
    });
    const newData = [];
    if (type === index.TimeSharingType.Min) {
        let i = 0;
        while (i < timeList.length) {
            const min = Number(timeList[i].time.split(' ')[1].split(':')[1]);
            if (min === 0 || min % value === 0) {
                newData.push({
                    ...kLineChartData[i],
                });
                i += 1;
            }
            else {
                const remainder = min % value;
                let tempIndex = remainder;
                const tempObj = {};
                while (tempIndex <= value && i < timeList.length) {
                    if (!tempObj.low) {
                        tempObj.low = kLineChartData[i].low;
                    }
                    else {
                        if (kLineChartData[i].low < tempObj.low) {
                            tempObj.low = kLineChartData[i].low;
                        }
                    }
                    if (!tempObj.high) {
                        tempObj.high = kLineChartData[i].high;
                    }
                    else {
                        if (kLineChartData[i].high > tempObj.high) {
                            tempObj.high = kLineChartData[i].high;
                        }
                    }
                    if (tempIndex === remainder) {
                        tempObj.open = kLineChartData[i].open;
                    }
                    tempObj.close = kLineChartData[i].close;
                    tempIndex += 1;
                    i += 1;
                    if (i === timeList.length) {
                        tempObj.time = kLineChartData[i - 1].time + 1000 * 60 * (value - tempIndex + 1);
                    }
                    else {
                        tempObj.time = kLineChartData[i - 1].time;
                    }
                }
                newData.push({
                    ...tempObj,
                });
            }
        }
    }
    if (type === index.TimeSharingType.Hour) {
        let i = 0;
        while (i < timeList.length) {
            const hour = Number(timeList[i].time.split(' ')[1].split(':')[0]);
            const min = Number(timeList[i].time.split(' ')[1].split(':')[1]);
            if (min === 0 && hour % value === 0) {
                newData.push({
                    ...kLineChartData[i],
                });
                i += 1;
            }
            else {
                const remainder = hour % value;
                let tempIndex = remainder * 60 + min;
                const _tempIndex = tempIndex;
                const tempObj = {};
                while (tempIndex <= value * 60 && i < timeList.length) {
                    if (!tempObj.low) {
                        tempObj.low = kLineChartData[i].low;
                    }
                    else {
                        if (kLineChartData[i].low < tempObj.low) {
                            tempObj.low = kLineChartData[i].low;
                        }
                    }
                    if (!tempObj.high) {
                        tempObj.high = kLineChartData[i].high;
                    }
                    else {
                        if (kLineChartData[i].high > tempObj.high) {
                            tempObj.high = kLineChartData[i].high;
                        }
                    }
                    if (tempIndex === _tempIndex) {
                        tempObj.open = kLineChartData[i].open;
                    }
                    tempObj.close = kLineChartData[i].close;
                    tempIndex += 1;
                    i += 1;
                    if (i === timeList.length) {
                        tempObj.time = kLineChartData[i - 1].time + 1000 * 60 * (value * 60 - tempIndex + 1);
                    }
                    else {
                        tempObj.time = kLineChartData[i - 1].time;
                    }
                }
                newData.push({
                    ...tempObj,
                });
            }
        }
    }
    if (type === index.TimeSharingType.Week) {
        let i = 0;
        while (i < timeList.length) {
            const date = timeList[i].time.split(' ')[0];
            const dayOfWeek = dayjs__default["default"](kLineChartData[i].time).day();
            const _tempIndex = i;
            const newDate = dayOfWeek === 7
                ? timeList[i].time.split(' ')[0]
                : dayjs__default["default"](timeList[i].time.split(' ')[0])
                    .add(7 - dayOfWeek, 'day')
                    .format('YYYY-MM-DD');
            const tempObj = {};
            let tempDate = date;
            while (dayjs__default["default"](tempDate).isBetween(date, newDate, null, '[]') && i < timeList.length) {
                if (!tempObj.low) {
                    tempObj.low = kLineChartData[i].low;
                }
                else {
                    if (kLineChartData[i].low < tempObj.low) {
                        tempObj.low = kLineChartData[i].low;
                    }
                }
                if (!tempObj.high) {
                    tempObj.high = kLineChartData[i].high;
                }
                else {
                    if (kLineChartData[i].high > tempObj.high) {
                        tempObj.high = kLineChartData[i].high;
                    }
                }
                if (_tempIndex === i) {
                    tempObj.open = kLineChartData[i].open;
                }
                tempObj.close = kLineChartData[i].close;
                i += 1;
                tempObj.time = dayjs__default["default"](newDate).valueOf();
                if (i !== timeList.length) {
                    tempDate = timeList[i].time.split(' ')[0];
                }
            }
            newData.push({
                ...tempObj,
            });
        }
    }
    if (type === index.TimeSharingType.Mon) {
        let i = 0;
        while (i < timeList.length) {
            const year = Number(timeList[i].time.split(' ')[0].split('-')[0]);
            const mon = Number(timeList[i].time.split(' ')[0].split('-')[1]);
            const remainder = mon % value;
            let tempMon = mon;
            let tempYear = year;
            const _tempIndex = i;
            const tempObj = {};
            while (tempMon === mon && tempYear === year && i < timeList.length) {
                if (!tempObj.low) {
                    tempObj.low = kLineChartData[i].low;
                }
                else {
                    if (kLineChartData[i].low < tempObj.low) {
                        tempObj.low = kLineChartData[i].low;
                    }
                }
                if (!tempObj.high) {
                    tempObj.high = kLineChartData[i].high;
                }
                else {
                    if (kLineChartData[i].high > tempObj.high) {
                        tempObj.high = kLineChartData[i].high;
                    }
                }
                if (_tempIndex === i) {
                    tempObj.open = kLineChartData[i].open;
                }
                tempObj.close = kLineChartData[i].close;
                i += 1;
                if (Number(timeList[i === timeList.length ? i - 1 : i].time.split(' ')[0].split('-')[0]) !== tempYear ||
                    Number(timeList[i === timeList.length ? i - 1 : i].time.split(' ')[0].split('-')[1]) !== tempMon) {
                    tempYear = Number(timeList[i === timeList.length ? i - 1 : i].time.split(' ')[0].split('-')[0]);
                    tempMon = Number(timeList[i === timeList.length ? i - 1 : i].time.split(' ')[0].split('-')[1]);
                }
                if (i === timeList.length) {
                    tempObj.time = dayjs__default["default"](`${tempMon + value - remainder > 12 ? tempYear + 1 : tempYear}-${tempMon + value - remainder > 12 ? tempMon + value - remainder - 12 : tempMon + value - remainder}-1`).valueOf();
                }
                else {
                    tempObj.time = kLineChartData[i - 1].time;
                }
            }
            newData.push({
                ...tempObj,
            });
        }
    }
    return newData;
};
const calBoll = (data, calcParams = [20, 2], priceOffset) => {
    let BOLL_N = calcParams[0];
    let BOLL_P = calcParams[1];
    let close;
    let mid;
    let upper;
    let lower;
    let i;
    let j;
    let item = [];
    let val;
    let std;
    let sumTotal = 0;
    for (i = 0; i < data.length; i += 1) {
        close = data[i]?.close;
        sumTotal += close;
        if (i >= BOLL_N - 1) {
            mid = sumTotal / BOLL_N;
            std = 0;
            for (j = i - (BOLL_N - 1); j <= i; j += 1) {
                val = data[j]?.close - mid;
                std += val * val;
            }
            std = Math.sqrt(std / BOLL_N);
            upper = mid + BOLL_P * std;
            lower = mid - BOLL_P * std;
            sumTotal -= data[i - (BOLL_N - 1)]?.close;
        }
        else {
            mid = 0;
            upper = 0;
            lower = 0;
        }
        if (mid && upper && lower) {
            item.push({
                mid: Number(mid?.toFixed(priceOffset)),
                upper: Number(upper?.toFixed(priceOffset)),
                lower: Number(lower?.toFixed(priceOffset)),
                time: data[i]?.time,
            });
        }
    }
    return item;
};
/**
 * 计算KDJ指标
 * EMV：随机指标。一般是用于股票分析的统计体系，根据统计学原理，通过一个特定的周期（常为9日、9周等）内出现过的最高价、最低价及
 * 最后一个计算周期的收盘价及这三者之间的比例关系，来计算最后一个计算周期的未成熟随机值RSV，然后根据平滑移动平均线的方法来计算K值、D值与J值，
 * 并绘成曲线图来研判股票价格走势。
 *
 * KDJ指标计算方式
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
function calKdj(data, calcParams = [9, 3, 3], priceOffset) {
    let KDJ_N = calcParams[0];
    let KDJ_M1 = calcParams[1];
    let KDJ_M2 = calcParams[2];
    let close;
    let llvlow = Infinity;
    let llvhigh = -Infinity;
    let rsv;
    let a = 0;
    let b = 0;
    let e;
    let i;
    let j;
    let item = [];
    for (i = 0; i < data.length; i += 1) {
        close = data[i]?.close;
        // low = data[i]['i'];
        // high = data[i]['a'];
        llvlow = Infinity;
        llvhigh = -Infinity;
        if (i < KDJ_N) {
            j = 0;
        }
        else {
            j = i - KDJ_N + 1;
        }
        for (; j <= i; j += 1) {
            if (llvlow > data[j]?.low) {
                llvlow = data[j]?.low;
            }
            if (llvhigh < data[j]?.high) {
                llvhigh = data[j]?.high;
            }
        }
        rsv = ((close - llvlow) / (llvhigh - llvlow)) * 100;
        if (isNaN(rsv) || rsv === -Infinity || rsv === Infinity)
            rsv = 0;
        if (i < KDJ_N) {
            a = (rsv + a * i) / (i + 1);
            b = (a + b * i) / (i + 1);
        }
        else {
            a = (rsv + (KDJ_M1 - 1) * a) / KDJ_M1;
            b = (a + (KDJ_M2 - 1) * b) / KDJ_M2;
        }
        e = 3 * a - 2 * b;
        item.push({
            k: Number(a?.toFixed(priceOffset)),
            d: Number(b?.toFixed(priceOffset)),
            j: Number(e?.toFixed(priceOffset)),
            time: data[i]?.time,
        });
    }
    return item;
}
/**
 * EMA
 * @param {number} X
 * @param {number} YPre 客户端指标解释中的 Y'
 * @param {number} N
 * @returns {number}
 */
const EMA = function (X, YPre, N) {
    YPre = YPre || 0;
    return (2 * X + (N - 1) * YPre) / (N + 1);
};
const MAX = function (a, b) {
    return +a > +b ? +a : +b;
};
const MIN = function (a, b) {
    return +a < +b ? +a : +b;
};
/*
 * 取绝对值
 */
const ABS = function (a) {
    return Math.abs(+a);
};
const SMA = function (x, n, m, y) {
    return (m * x + (n - m) * y) / n;
};
function calRsi(data, calcParams = [6, 12, 24], priceOffset) {
    let RSI_N1 = calcParams[0];
    let RSI_N2 = calcParams[1];
    let RSI_N3 = calcParams[2];
    let close;
    let lc;
    let r;
    let r1;
    let r2;
    let s;
    let s1;
    let s2;
    let i;
    let i1;
    let i2;
    let j;
    let item = [];
    for (j = 0; j < data.length; j += 1) {
        close = data[j]?.close;
        if (j === 0) {
            lc = close;
            // eslint-disable-next-line no-multi-assign
            r1 = s1 = i1 = 0;
            // eslint-disable-next-line no-multi-assign
            r2 = s2 = i2 = 0;
        }
        else {
            lc = data[j - 1].close;
            r1 = SMA(MAX(close - lc, 0), RSI_N1, 1, r1);
            r2 = SMA(ABS(close - lc), RSI_N1, 1, r2);
            s1 = SMA(MAX(close - lc, 0), RSI_N2, 1, s1);
            s2 = SMA(ABS(close - lc), RSI_N2, 1, s2);
            i1 = SMA(MAX(close - lc, 0), RSI_N3, 1, i1);
            i2 = SMA(ABS(close - lc), RSI_N3, 1, i2);
        }
        r = (r1 / r2) * 100 || 0;
        s = (s1 / s2) * 100 || 0;
        i = (i1 / i2) * 100 || 0;
        item.push({
            r: Number(r?.toFixed(priceOffset)),
            s: Number(s?.toFixed(priceOffset)),
            i: Number(i?.toFixed(priceOffset)),
            time: data[j]?.time,
        });
    }
    return item;
}
// export interface ISTOCK {
//   open: number // 开盘价
//   close: number // 收盘价
//   high: number // 最高价
//   low: number // 最低价
// }
/**
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
function calcHnLn(dataList) {
    let hn = Number.MIN_SAFE_INTEGER;
    let ln = Number.MAX_SAFE_INTEGER;
    dataList.forEach(data => {
        hn = Math.max(data.high, hn);
        ln = Math.min(data.low, ln);
    });
    return { hn, ln };
}
function calWr(dataList, options, plots = [
    { key: 'wr1', title: 'wr1' },
    { key: 'wr2', title: 'wr2' },
], priceOffset) {
    return dataList.map((kLineData, i) => {
        // tslint:disable-next-line: no-shadowed-variable
        const wr = {
            wr1: 0,
            wr2: 0,
            time: kLineData?.time,
        };
        const close = kLineData?.close;
        options.forEach((param, index) => {
            const p = param - 1;
            if (i >= p) {
                const hln = calcHnLn(dataList?.slice(i - p, i + 1));
                const hn = hln.hn;
                const ln = hln.ln;
                const hnSubLn = hn - ln;
                wr[plots[index].key] = hnSubLn === 0 ? 0 : Number((((hn - close) / hnSubLn) * 100).toFixed(priceOffset));
            }
        });
        return wr;
    });
}
/** 计算涨跌幅 */
const calcChg = (value, priceOffset) => {
    if (!Number(value?.open)) {
        let temp = 0;
        return `${temp.toFixed(2)}%`;
    }
    const difference = (Number(value?.close) - Number(value?.open));
    const result = difference / Number(value?.open) * 100;
    return `${result?.toFixed(2)}%`;
};
/** 计算振幅 */
const calcAmp = (value, priceOffset) => {
    if (!Number(value?.low)) {
        let temp = 0;
        return `${temp.toFixed(2)}%`;
    }
    const difference = (Number(value?.high) - Number(value?.low));
    const result = difference / Number(value?.low) * 100;
    return `${result?.toFixed(2)}%`;
};

exports.ABS = ABS;
exports.EMA = EMA;
exports.MAX = MAX;
exports.MIN = MIN;
exports.SMA = SMA;
exports.calBoll = calBoll;
exports.calKdj = calKdj;
exports.calRsi = calRsi;
exports.calWr = calWr;
exports.calcAmp = calcAmp;
exports.calcChg = calcChg;
exports.calcHnLn = calcHnLn;
exports.calculateEMA = calculateEMA;
exports.calculateMACD = calculateMACD;
exports.calculateSMA = calculateSMA;
exports.updateTimeOfData = updateTimeOfData;
