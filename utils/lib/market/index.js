'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index$1 = require('../decimal/index.js');

const up_color_class = 'text-buy_up_color';
const down_color_class = 'text-sell_down_color';
/**
 * 计算两个值相对涨跌
 * @param price 当前价格
 * @param target 目标价格，可空，如果不传就是和 0 进行比较
 * @returns 'text-buy_up_color' | 'text-sell_down_color' | ''
 */
function getColorClassByPrice(price, target = 0) {
    if (!price || price === '--' || (!target && target !== 0) || target === '--') {
        return '';
    }
    const _price = index$1.getSafeDecimal(price);
    const _targetPrice = index$1.getSafeDecimal(target);
    if (_price.gt(_targetPrice)) {
        return up_color_class;
    }
    else if (_price.eq(_targetPrice)) {
        return '';
    }
    else {
        return down_color_class;
    }
}

exports.getColorClassByPrice = getColorClassByPrice;
