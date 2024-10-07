'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const getColor = (color) => {
    return getComputedStyle(document.body)
        .getPropertyValue(color)
        .replace(/(^\s*)|(\s*$)/g, '');
};
const getTheme = () => {
    const bgColor = getColor('--bg_color');
    const textColor = getColor('--text_color_03');
    const brandColor = getColor('--brand_color');
    const upColor = getColor('--buy_up_color');
    const downColor = getColor('--sell_down_color');
    const upLightColor = getColor('--buy_up_color_hover');
    const downLightColor = getColor('--sell_down_color_hover');
    const upSpecialColor02 = getColor('--buy_up_color_special_02');
    const downSpecialColor02 = getColor('--sell_down_color_special_02');
    const cardBgColor = getColor('--card_bg_color_01');
    const cardBgColor02 = getColor('--card_bg_color_02');
    const cardBgColor03 = getColor('--card_bg_color_03');
    const textColor01 = getColor('--text_color_01');
    const textColor02 = getColor('--text_color_02');
    return {
        bgColor,
        textColor,
        brandColor,
        upColor,
        downColor,
        upLightColor,
        downLightColor,
        upSpecialColor02,
        downSpecialColor02,
        cardBgColor,
        cardBgColor03,
        textColor01,
        cardBgColor02,
        textColor02
    };
};

exports.getTheme = getTheme;
