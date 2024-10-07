function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { TimeSharingType } from '../type/index.js';
dayjs.extend(isBetween);
/**
 * 计算 SMA
 */
var calculateSMA = function calculateSMA(data, count, price, priceOffset) {
  var result = [];
  var avg = function avg(data) {
    var sum = 0;
    for (var i = 0; i < data.length; i += 1) {
      var _data$i;
      sum += (_data$i = data[i]) === null || _data$i === void 0 ? void 0 : _data$i[price];
    }
    return sum / data.length;
  };
  for (var i = count - 1, len = data.length; i < len; i += 1) {
    var val = avg(data.slice(i - count + 1, i + 1));
    if (i - count + 1 === 0) {
      for (var j = 0; j < count; j += 1) {
        var _data$j;
        result.push({
          time: (_data$j = data[j]) === null || _data$j === void 0 ? void 0 : _data$j.time,
          value: Number(val.toFixed(priceOffset))
        });
      }
    } else {
      var _data$i2;
      result.push({
        time: (_data$i2 = data[i]) === null || _data$i2 === void 0 ? void 0 : _data$i2.time,
        value: Number(val.toFixed(priceOffset))
      });
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
var calculateEMA = function calculateEMA(ema, price, period) {
  return (2 * price + (period - 1) * ema) / (period + 1);
};
/**
 * 计算 MACD
 * fast 快线
 * slow 慢线
 * signal 日期
 */
var calculateMACD = function calculateMACD(data, fast, slow, signal, priceOffset) {
  var newData = [];
  data.forEach(function (item, index) {
    var emaFast = 0;
    var emaSlow = 0;
    var dea = 0;
    var dif = 0;
    if (index < fast - 1) {
      emaFast = 0;
    } else {
      var _newData;
      emaFast = calculateEMA(((_newData = newData[index - 1]) === null || _newData === void 0 ? void 0 : _newData.emaFast) || 0, item.close, fast);
    }
    if (index < slow - 1) {
      emaSlow = 0;
    } else {
      var _newData2;
      emaSlow = calculateEMA(((_newData2 = newData[index - 1]) === null || _newData2 === void 0 ? void 0 : _newData2.emaSlow) || 0, item.close, slow);
    }
    dif = emaFast - emaSlow;
    if (index < signal - 1) {
      dea = 0;
    } else {
      var _newData3;
      dea = calculateEMA(((_newData3 = newData[index - 1]) === null || _newData3 === void 0 ? void 0 : _newData3.dea) || 0, dif, signal);
    }
    newData.push({
      emaFast: Number(emaFast.toFixed(priceOffset)),
      emaSlow: Number(emaSlow.toFixed(priceOffset)),
      dif: Number(dif.toFixed(priceOffset)),
      dea: Number(dea.toFixed(priceOffset)),
      value: Number(((dif - dea) * 2).toFixed(priceOffset)),
      time: item.time
    });
  });
  return newData;
};
var updateTimeOfData = function updateTimeOfData(value, type, kLineChartData) {
  var timeList = kLineChartData.map(function (item, index) {
    return {
      index: index,
      time: dayjs(item.time).format('YYYY-MM-DD HH:mm')
    };
  });
  var newData = [];
  if (type === TimeSharingType.Min) {
    var i = 0;
    while (i < timeList.length) {
      var min = Number(timeList[i].time.split(' ')[1].split(':')[1]);
      if (min === 0 || min % value === 0) {
        newData.push(_objectSpread({}, kLineChartData[i]));
        i += 1;
      } else {
        var remainder = min % value;
        var tempIndex = remainder;
        var tempObj = {};
        while (tempIndex <= value && i < timeList.length) {
          if (!tempObj.low) {
            tempObj.low = kLineChartData[i].low;
          } else {
            if (kLineChartData[i].low < tempObj.low) {
              tempObj.low = kLineChartData[i].low;
            }
          }
          if (!tempObj.high) {
            tempObj.high = kLineChartData[i].high;
          } else {
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
          } else {
            tempObj.time = kLineChartData[i - 1].time;
          }
        }
        newData.push(_objectSpread({}, tempObj));
      }
    }
  }
  if (type === TimeSharingType.Hour) {
    var _i = 0;
    while (_i < timeList.length) {
      var hour = Number(timeList[_i].time.split(' ')[1].split(':')[0]);
      var _min = Number(timeList[_i].time.split(' ')[1].split(':')[1]);
      if (_min === 0 && hour % value === 0) {
        newData.push(_objectSpread({}, kLineChartData[_i]));
        _i += 1;
      } else {
        var _remainder = hour % value;
        var _tempIndex2 = _remainder * 60 + _min;
        var _tempIndex = _tempIndex2;
        var _tempObj = {};
        while (_tempIndex2 <= value * 60 && _i < timeList.length) {
          if (!_tempObj.low) {
            _tempObj.low = kLineChartData[_i].low;
          } else {
            if (kLineChartData[_i].low < _tempObj.low) {
              _tempObj.low = kLineChartData[_i].low;
            }
          }
          if (!_tempObj.high) {
            _tempObj.high = kLineChartData[_i].high;
          } else {
            if (kLineChartData[_i].high > _tempObj.high) {
              _tempObj.high = kLineChartData[_i].high;
            }
          }
          if (_tempIndex2 === _tempIndex) {
            _tempObj.open = kLineChartData[_i].open;
          }
          _tempObj.close = kLineChartData[_i].close;
          _tempIndex2 += 1;
          _i += 1;
          if (_i === timeList.length) {
            _tempObj.time = kLineChartData[_i - 1].time + 1000 * 60 * (value * 60 - _tempIndex2 + 1);
          } else {
            _tempObj.time = kLineChartData[_i - 1].time;
          }
        }
        newData.push(_objectSpread({}, _tempObj));
      }
    }
  }
  if (type === TimeSharingType.Week) {
    var _i2 = 0;
    while (_i2 < timeList.length) {
      var date = timeList[_i2].time.split(' ')[0];
      var dayOfWeek = dayjs(kLineChartData[_i2].time).day();
      var _tempIndex3 = _i2;
      var newDate = dayOfWeek === 7 ? timeList[_i2].time.split(' ')[0] : dayjs(timeList[_i2].time.split(' ')[0]).add(7 - dayOfWeek, 'day').format('YYYY-MM-DD');
      var _tempObj2 = {};
      var tempDate = date;
      while (dayjs(tempDate).isBetween(date, newDate, null, '[]') && _i2 < timeList.length) {
        if (!_tempObj2.low) {
          _tempObj2.low = kLineChartData[_i2].low;
        } else {
          if (kLineChartData[_i2].low < _tempObj2.low) {
            _tempObj2.low = kLineChartData[_i2].low;
          }
        }
        if (!_tempObj2.high) {
          _tempObj2.high = kLineChartData[_i2].high;
        } else {
          if (kLineChartData[_i2].high > _tempObj2.high) {
            _tempObj2.high = kLineChartData[_i2].high;
          }
        }
        if (_tempIndex3 === _i2) {
          _tempObj2.open = kLineChartData[_i2].open;
        }
        _tempObj2.close = kLineChartData[_i2].close;
        _i2 += 1;
        _tempObj2.time = dayjs(newDate).valueOf();
        if (_i2 !== timeList.length) {
          tempDate = timeList[_i2].time.split(' ')[0];
        }
      }
      newData.push(_objectSpread({}, _tempObj2));
    }
  }
  if (type === TimeSharingType.Mon) {
    var _i3 = 0;
    while (_i3 < timeList.length) {
      var year = Number(timeList[_i3].time.split(' ')[0].split('-')[0]);
      var mon = Number(timeList[_i3].time.split(' ')[0].split('-')[1]);
      var _remainder2 = mon % value;
      var tempMon = mon;
      var tempYear = year;
      var _tempIndex4 = _i3;
      var _tempObj3 = {};
      while (tempMon === mon && tempYear === year && _i3 < timeList.length) {
        if (!_tempObj3.low) {
          _tempObj3.low = kLineChartData[_i3].low;
        } else {
          if (kLineChartData[_i3].low < _tempObj3.low) {
            _tempObj3.low = kLineChartData[_i3].low;
          }
        }
        if (!_tempObj3.high) {
          _tempObj3.high = kLineChartData[_i3].high;
        } else {
          if (kLineChartData[_i3].high > _tempObj3.high) {
            _tempObj3.high = kLineChartData[_i3].high;
          }
        }
        if (_tempIndex4 === _i3) {
          _tempObj3.open = kLineChartData[_i3].open;
        }
        _tempObj3.close = kLineChartData[_i3].close;
        _i3 += 1;
        if (Number(timeList[_i3 === timeList.length ? _i3 - 1 : _i3].time.split(' ')[0].split('-')[0]) !== tempYear || Number(timeList[_i3 === timeList.length ? _i3 - 1 : _i3].time.split(' ')[0].split('-')[1]) !== tempMon) {
          tempYear = Number(timeList[_i3 === timeList.length ? _i3 - 1 : _i3].time.split(' ')[0].split('-')[0]);
          tempMon = Number(timeList[_i3 === timeList.length ? _i3 - 1 : _i3].time.split(' ')[0].split('-')[1]);
        }
        if (_i3 === timeList.length) {
          _tempObj3.time = dayjs("".concat(tempMon + value - _remainder2 > 12 ? tempYear + 1 : tempYear, "-").concat(tempMon + value - _remainder2 > 12 ? tempMon + value - _remainder2 - 12 : tempMon + value - _remainder2, "-1")).valueOf();
        } else {
          _tempObj3.time = kLineChartData[_i3 - 1].time;
        }
      }
      newData.push(_objectSpread({}, _tempObj3));
    }
  }
  return newData;
};
var calBoll = function calBoll(data) {
  var calcParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [20, 2];
  var priceOffset = arguments.length > 2 ? arguments[2] : undefined;
  var BOLL_N = calcParams[0];
  var BOLL_P = calcParams[1];
  var close;
  var mid;
  var upper;
  var lower;
  var i;
  var j;
  var item = [];
  var val;
  var std;
  var sumTotal = 0;
  for (i = 0; i < data.length; i += 1) {
    var _data$i3;
    close = (_data$i3 = data[i]) === null || _data$i3 === void 0 ? void 0 : _data$i3.close;
    sumTotal += close;
    if (i >= BOLL_N - 1) {
      var _data;
      mid = sumTotal / BOLL_N;
      std = 0;
      for (j = i - (BOLL_N - 1); j <= i; j += 1) {
        var _data$j2;
        val = ((_data$j2 = data[j]) === null || _data$j2 === void 0 ? void 0 : _data$j2.close) - mid;
        std += val * val;
      }
      std = Math.sqrt(std / BOLL_N);
      upper = mid + BOLL_P * std;
      lower = mid - BOLL_P * std;
      sumTotal -= (_data = data[i - (BOLL_N - 1)]) === null || _data === void 0 ? void 0 : _data.close;
    } else {
      mid = 0;
      upper = 0;
      lower = 0;
    }
    if (mid && upper && lower) {
      var _mid, _upper, _lower, _data$i4;
      item.push({
        mid: Number((_mid = mid) === null || _mid === void 0 ? void 0 : _mid.toFixed(priceOffset)),
        upper: Number((_upper = upper) === null || _upper === void 0 ? void 0 : _upper.toFixed(priceOffset)),
        lower: Number((_lower = lower) === null || _lower === void 0 ? void 0 : _lower.toFixed(priceOffset)),
        time: (_data$i4 = data[i]) === null || _data$i4 === void 0 ? void 0 : _data$i4.time
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
function calKdj(data) {
  var calcParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [9, 3, 3];
  var priceOffset = arguments.length > 2 ? arguments[2] : undefined;
  var KDJ_N = calcParams[0];
  var KDJ_M1 = calcParams[1];
  var KDJ_M2 = calcParams[2];
  var close;
  var llvlow = Infinity;
  var llvhigh = -Infinity;
  var rsv;
  var a = 0;
  var b = 0;
  var e;
  var i;
  var j;
  var item = [];
  for (i = 0; i < data.length; i += 1) {
    var _data$i5, _a, _b, _e, _data$i6;
    close = (_data$i5 = data[i]) === null || _data$i5 === void 0 ? void 0 : _data$i5.close;
    // low = data[i]['i'];
    // high = data[i]['a'];
    llvlow = Infinity;
    llvhigh = -Infinity;
    if (i < KDJ_N) {
      j = 0;
    } else {
      j = i - KDJ_N + 1;
    }
    for (; j <= i; j += 1) {
      var _data$j3, _data$j5;
      if (llvlow > ((_data$j3 = data[j]) === null || _data$j3 === void 0 ? void 0 : _data$j3.low)) {
        var _data$j4;
        llvlow = (_data$j4 = data[j]) === null || _data$j4 === void 0 ? void 0 : _data$j4.low;
      }
      if (llvhigh < ((_data$j5 = data[j]) === null || _data$j5 === void 0 ? void 0 : _data$j5.high)) {
        var _data$j6;
        llvhigh = (_data$j6 = data[j]) === null || _data$j6 === void 0 ? void 0 : _data$j6.high;
      }
    }
    rsv = (close - llvlow) / (llvhigh - llvlow) * 100;
    if (isNaN(rsv) || rsv === -Infinity || rsv === Infinity) rsv = 0;
    if (i < KDJ_N) {
      a = (rsv + a * i) / (i + 1);
      b = (a + b * i) / (i + 1);
    } else {
      a = (rsv + (KDJ_M1 - 1) * a) / KDJ_M1;
      b = (a + (KDJ_M2 - 1) * b) / KDJ_M2;
    }
    e = 3 * a - 2 * b;
    item.push({
      k: Number((_a = a) === null || _a === void 0 ? void 0 : _a.toFixed(priceOffset)),
      d: Number((_b = b) === null || _b === void 0 ? void 0 : _b.toFixed(priceOffset)),
      j: Number((_e = e) === null || _e === void 0 ? void 0 : _e.toFixed(priceOffset)),
      time: (_data$i6 = data[i]) === null || _data$i6 === void 0 ? void 0 : _data$i6.time
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
var EMA = function EMA(X, YPre, N) {
  YPre = YPre || 0;
  return (2 * X + (N - 1) * YPre) / (N + 1);
};
var MAX = function MAX(a, b) {
  return +a > +b ? +a : +b;
};
var MIN = function MIN(a, b) {
  return +a < +b ? +a : +b;
};
/*
 * 取绝对值
 */
var ABS = function ABS(a) {
  return Math.abs(+a);
};
var SMA = function SMA(x, n, m, y) {
  return (m * x + (n - m) * y) / n;
};
function calRsi(data) {
  var calcParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [6, 12, 24];
  var priceOffset = arguments.length > 2 ? arguments[2] : undefined;
  var RSI_N1 = calcParams[0];
  var RSI_N2 = calcParams[1];
  var RSI_N3 = calcParams[2];
  var close;
  var lc;
  var r;
  var r1;
  var r2;
  var s;
  var s1;
  var s2;
  var i;
  var i1;
  var i2;
  var j;
  var item = [];
  for (j = 0; j < data.length; j += 1) {
    var _data$j7, _r, _s, _i4, _data$j8;
    close = (_data$j7 = data[j]) === null || _data$j7 === void 0 ? void 0 : _data$j7.close;
    if (j === 0) {
      lc = close;
      // eslint-disable-next-line no-multi-assign
      r1 = s1 = i1 = 0;
      // eslint-disable-next-line no-multi-assign
      r2 = s2 = i2 = 0;
    } else {
      lc = data[j - 1].close;
      r1 = SMA(MAX(close - lc, 0), RSI_N1, 1, r1);
      r2 = SMA(ABS(close - lc), RSI_N1, 1, r2);
      s1 = SMA(MAX(close - lc, 0), RSI_N2, 1, s1);
      s2 = SMA(ABS(close - lc), RSI_N2, 1, s2);
      i1 = SMA(MAX(close - lc, 0), RSI_N3, 1, i1);
      i2 = SMA(ABS(close - lc), RSI_N3, 1, i2);
    }
    r = r1 / r2 * 100 || 0;
    s = s1 / s2 * 100 || 0;
    i = i1 / i2 * 100 || 0;
    item.push({
      r: Number((_r = r) === null || _r === void 0 ? void 0 : _r.toFixed(priceOffset)),
      s: Number((_s = s) === null || _s === void 0 ? void 0 : _s.toFixed(priceOffset)),
      i: Number((_i4 = i) === null || _i4 === void 0 ? void 0 : _i4.toFixed(priceOffset)),
      time: (_data$j8 = data[j]) === null || _data$j8 === void 0 ? void 0 : _data$j8.time
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
  var hn = Number.MIN_SAFE_INTEGER;
  var ln = Number.MAX_SAFE_INTEGER;
  dataList.forEach(function (data) {
    hn = Math.max(data.high, hn);
    ln = Math.min(data.low, ln);
  });
  return {
    hn: hn,
    ln: ln
  };
}
function calWr(dataList, options) {
  var plots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [{
    key: 'wr1',
    title: 'wr1'
  }, {
    key: 'wr2',
    title: 'wr2'
  }];
  var priceOffset = arguments.length > 3 ? arguments[3] : undefined;
  return dataList.map(function (kLineData, i) {
    // tslint:disable-next-line: no-shadowed-variable
    var wr = {
      wr1: 0,
      wr2: 0,
      time: kLineData === null || kLineData === void 0 ? void 0 : kLineData.time
    };
    var close = kLineData === null || kLineData === void 0 ? void 0 : kLineData.close;
    options.forEach(function (param, index) {
      var p = param - 1;
      if (i >= p) {
        var hln = calcHnLn(dataList === null || dataList === void 0 ? void 0 : dataList.slice(i - p, i + 1));
        var hn = hln.hn;
        var ln = hln.ln;
        var hnSubLn = hn - ln;
        wr[plots[index].key] = hnSubLn === 0 ? 0 : Number(((hn - close) / hnSubLn * 100).toFixed(priceOffset));
      }
    });
    return wr;
  });
}
/** 计算涨跌幅 */
var calcChg = function calcChg(value, priceOffset) {
  if (!Number(value === null || value === void 0 ? void 0 : value.open)) {
    var temp = 0;
    return "".concat(temp.toFixed(2), "%");
  }
  var difference = Number(value === null || value === void 0 ? void 0 : value.close) - Number(value === null || value === void 0 ? void 0 : value.open);
  var result = difference / Number(value === null || value === void 0 ? void 0 : value.open) * 100;
  return "".concat(result === null || result === void 0 ? void 0 : result.toFixed(2), "%");
};
/** 计算振幅 */
var calcAmp = function calcAmp(value, priceOffset) {
  if (!Number(value === null || value === void 0 ? void 0 : value.low)) {
    var temp = 0;
    return "".concat(temp.toFixed(2), "%");
  }
  var difference = Number(value === null || value === void 0 ? void 0 : value.high) - Number(value === null || value === void 0 ? void 0 : value.low);
  var result = difference / Number(value === null || value === void 0 ? void 0 : value.low) * 100;
  return "".concat(result === null || result === void 0 ? void 0 : result.toFixed(2), "%");
};
export { ABS, EMA, MAX, MIN, SMA, calBoll, calKdj, calRsi, calWr, calcAmp, calcChg, calcHnLn, calculateEMA, calculateMACD, calculateSMA, updateTimeOfData };
