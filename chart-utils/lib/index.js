'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./const/index.js');
var index$1 = require('./type/index.js');
var index$2 = require('./util/index.js');
var indicator = require('./util/indicator.js');
var theme = require('./util/theme.js');



exports.LanguageMapToChartMap = index.LanguageMapToChartMap;
exports.ThemeChartMap = index.ThemeChartMap;
Object.defineProperty(exports, 'ThemeEnum', {
	enumerable: true,
	get: function () { return index.ThemeEnum; }
});
Object.defineProperty(exports, 'TradingviewIndicatorType', {
	enumerable: true,
	get: function () { return index.TradingviewIndicatorType; }
});
Object.defineProperty(exports, 'WSThrottleTypeEnum', {
	enumerable: true,
	get: function () { return index.WSThrottleTypeEnum; }
});
exports.bollKList = index.bollKList;
exports.kdjKList = index.kdjKList;
exports.macdKList = index.macdKList;
exports.shareTimeList = index.shareTimeList;
exports.timeLocaleLanguageMap = index.timeLocaleLanguageMap;
exports.timeMap = index.timeMap;
exports.tradingviewTimeMap = index.tradingviewTimeMap;
Object.defineProperty(exports, 'DeptChartSpecieEnum', {
	enumerable: true,
	get: function () { return index$1.DeptChartSpecieEnum; }
});
Object.defineProperty(exports, 'KLineChartType', {
	enumerable: true,
	get: function () { return index$1.KLineChartType; }
});
Object.defineProperty(exports, 'TimeSharingType', {
	enumerable: true,
	get: function () { return index$1.TimeSharingType; }
});
exports.checkIsUp = index$2.checkIsUp;
exports.fullscreen = index$2.fullscreen;
exports.getCurrentQuoteApiCoin = index$2.getCurrentQuoteApiCoin;
exports.getCurrentQuoteShowCoin = index$2.getCurrentQuoteShowCoin;
exports.showFormatTime = index$2.showFormatTime;
exports.sortMarketChartData = index$2.sortMarketChartData;
exports.ABS = indicator.ABS;
exports.EMA = indicator.EMA;
exports.MAX = indicator.MAX;
exports.MIN = indicator.MIN;
exports.SMA = indicator.SMA;
exports.calBoll = indicator.calBoll;
exports.calKdj = indicator.calKdj;
exports.calRsi = indicator.calRsi;
exports.calWr = indicator.calWr;
exports.calcAmp = indicator.calcAmp;
exports.calcChg = indicator.calcChg;
exports.calcHnLn = indicator.calcHnLn;
exports.calculateEMA = indicator.calculateEMA;
exports.calculateMACD = indicator.calculateMACD;
exports.calculateSMA = indicator.calculateSMA;
exports.updateTimeOfData = indicator.updateTimeOfData;
exports.getTheme = theme.getTheme;
