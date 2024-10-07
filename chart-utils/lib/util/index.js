'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dayjs = require('dayjs');
var index = require('../type/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);

const sortMarketChartData = (data) => {
    const sortData = data.sort((x, y) => {
        return x.time - y.time;
    });
    const timeList = [];
    const resultList = [];
    sortData.forEach(item => {
        if (timeList.indexOf(item.time) === -1) {
            timeList.push(item.time);
            resultList.push(item);
        }
    });
    return resultList;
};
/** 当前行情币对，ws 传给后端 */
const getCurrentQuoteApiCoin = (sellSymbol, buySymbol) => {
    return `${sellSymbol}_${buySymbol}`.toLowerCase();
};
/** 当前行情币对 页面展示 */
const getCurrentQuoteShowCoin = (sellSymbol, buySymbol) => {
    return `${sellSymbol}/${buySymbol}`;
};
/** 横屏功能 */
const fullscreen = (fullscreenRef, isFullScreen, setIsFullScreen) => {
    const tv = fullscreenRef.current;
    const _document = document;
    if (!isFullScreen) {
        if (tv?.requestFullscreen) {
            tv.requestFullscreen();
        }
        else if (tv?.webkitRequestFullScreen) {
            tv?.webkitRequestFullScreen();
        }
        else if (tv?.mozRequestFullScreen) {
            tv.mozRequestFullScreen();
        }
        else if (tv?.msRequestFullscreen) {
            // IE11
            tv.msRequestFullscreen();
        }
    }
    else {
        if (_document.exitFullscreen) {
            _document.exitFullscreen();
        }
        else if (_document.msExitFullscreen) {
            // IE11
            _document.msExitFullscreen();
        }
        else if (_document.mozCancelFullScreen) {
            _document.mozCancelFullScreen();
        }
        else if (_document.webkitExitFullscreen) {
            _document.webkitExitFullscreen();
        }
    }
    setIsFullScreen(!isFullScreen);
};
/** 上涨 */
const checkIsUp = (value) => {
    return value?.close > value?.open;
};
/** k 线横坐标 */
const showFormatTime = (item, unit) => {
    if (unit === index.TimeSharingType.Mon) {
        return dayjs__default["default"](item).format('YYYY-MM');
    }
    if (unit === index.TimeSharingType.Week || unit === index.TimeSharingType.Day) {
        return dayjs__default["default"](item).format('MM-DD');
    }
    if (unit === index.TimeSharingType.Second) {
        return dayjs__default["default"](item).format('HH:mm:ss');
    }
    return dayjs__default["default"](item).format('HH:mm');
};

exports.checkIsUp = checkIsUp;
exports.fullscreen = fullscreen;
exports.getCurrentQuoteApiCoin = getCurrentQuoteApiCoin;
exports.getCurrentQuoteShowCoin = getCurrentQuoteShowCoin;
exports.showFormatTime = showFormatTime;
exports.sortMarketChartData = sortMarketChartData;
