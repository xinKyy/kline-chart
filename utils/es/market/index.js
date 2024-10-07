import { getSafeDecimal } from '../decimal/index.js';
var up_color_class = 'text-buy_up_color';
var down_color_class = 'text-sell_down_color';
/**
 * 计算两个值相对涨跌
 * @param price 当前价格
 * @param target 目标价格，可空，如果不传就是和 0 进行比较
 * @returns 'text-buy_up_color' | 'text-sell_down_color' | ''
 */
function getColorClassByPrice(price) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!price || price === '--' || !target && target !== 0 || target === '--') {
    return '';
  }
  var _price = getSafeDecimal(price);
  var _targetPrice = getSafeDecimal(target);
  if (_price.gt(_targetPrice)) {
    return up_color_class;
  } else if (_price.eq(_targetPrice)) {
    return '';
  } else {
    return down_color_class;
  }
}
export { getColorClassByPrice };
