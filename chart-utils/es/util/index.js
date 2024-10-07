import dayjs from 'dayjs';
import { TimeSharingType } from '../type/index.js';
var sortMarketChartData = function sortMarketChartData(data) {
  var sortData = data.sort(function (x, y) {
    return x.time - y.time;
  });
  var timeList = [];
  var resultList = [];
  sortData.forEach(function (item) {
    if (timeList.indexOf(item.time) === -1) {
      timeList.push(item.time);
      resultList.push(item);
    }
  });
  return resultList;
};
/** 当前行情币对，ws 传给后端 */
var getCurrentQuoteApiCoin = function getCurrentQuoteApiCoin(sellSymbol, buySymbol) {
  return "".concat(sellSymbol, "_").concat(buySymbol).toLowerCase();
};
/** 当前行情币对 页面展示 */
var getCurrentQuoteShowCoin = function getCurrentQuoteShowCoin(sellSymbol, buySymbol) {
  return "".concat(sellSymbol, "/").concat(buySymbol);
};
/** 横屏功能 */
var fullscreen = function fullscreen(fullscreenRef, isFullScreen, setIsFullScreen) {
  var tv = fullscreenRef.current;
  var _document = document;
  if (!isFullScreen) {
    if (tv !== null && tv !== void 0 && tv.requestFullscreen) {
      tv.requestFullscreen();
    } else if (tv !== null && tv !== void 0 && tv.webkitRequestFullScreen) {
      tv === null || tv === void 0 ? void 0 : tv.webkitRequestFullScreen();
    } else if (tv !== null && tv !== void 0 && tv.mozRequestFullScreen) {
      tv.mozRequestFullScreen();
    } else if (tv !== null && tv !== void 0 && tv.msRequestFullscreen) {
      // IE11
      tv.msRequestFullscreen();
    }
  } else {
    if (_document.exitFullscreen) {
      _document.exitFullscreen();
    } else if (_document.msExitFullscreen) {
      // IE11
      _document.msExitFullscreen();
    } else if (_document.mozCancelFullScreen) {
      _document.mozCancelFullScreen();
    } else if (_document.webkitExitFullscreen) {
      _document.webkitExitFullscreen();
    }
  }
  setIsFullScreen(!isFullScreen);
};
/** 上涨 */
var checkIsUp = function checkIsUp(value) {
  return (value === null || value === void 0 ? void 0 : value.close) > (value === null || value === void 0 ? void 0 : value.open);
};
/** k 线横坐标 */
var showFormatTime = function showFormatTime(item, unit) {
  if (unit === TimeSharingType.Mon) {
    return dayjs(item).format('YYYY-MM');
  }
  if (unit === TimeSharingType.Week || unit === TimeSharingType.Day) {
    return dayjs(item).format('MM-DD');
  }
  if (unit === TimeSharingType.Second) {
    return dayjs(item).format('HH:mm:ss');
  }
  return dayjs(item).format('HH:mm');
};
export { checkIsUp, fullscreen, getCurrentQuoteApiCoin, getCurrentQuoteShowCoin, showFormatTime, sortMarketChartData };
