var getColor = function getColor(color) {
  return getComputedStyle(document.body).getPropertyValue(color).replace(/(^\s*)|(\s*$)/g, '');
};
var getTheme = function getTheme() {
  var bgColor = getColor('--bg_color');
  var textColor = getColor('--text_color_03');
  var brandColor = getColor('--brand_color');
  var upColor = getColor('--buy_up_color');
  var downColor = getColor('--sell_down_color');
  var upLightColor = getColor('--buy_up_color_hover');
  var downLightColor = getColor('--sell_down_color_hover');
  var upSpecialColor02 = getColor('--buy_up_color_special_02');
  var downSpecialColor02 = getColor('--sell_down_color_special_02');
  var cardBgColor = getColor('--card_bg_color_01');
  var cardBgColor02 = getColor('--card_bg_color_02');
  var cardBgColor03 = getColor('--card_bg_color_03');
  var textColor01 = getColor('--text_color_01');
  var textColor02 = getColor('--text_color_02');
  return {
    bgColor: bgColor,
    textColor: textColor,
    brandColor: brandColor,
    upColor: upColor,
    downColor: downColor,
    upLightColor: upLightColor,
    downLightColor: downLightColor,
    upSpecialColor02: upSpecialColor02,
    downSpecialColor02: downSpecialColor02,
    cardBgColor: cardBgColor,
    cardBgColor03: cardBgColor03,
    textColor01: textColor01,
    cardBgColor02: cardBgColor02,
    textColor02: textColor02
  };
};
export { getTheme };
