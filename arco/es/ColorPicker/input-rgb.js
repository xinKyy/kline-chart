import React, { useContext } from 'react';
import Input from '../Input';
import InputNumber from '../InputNumber';
import { ConfigContext } from '../ConfigProvider';
import { InputAlpha } from './input-alpha';
import { rgbToHsv } from '../_util/color';
export var InputRgb = function (_a) {
    var color = _a.color, alpha = _a.alpha, onHsvChange = _a.onHsvChange, onAlphaChange = _a.onAlphaChange, disabledAlpha = _a.disabledAlpha;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('color-picker');
    var onInputChange = function (_value) {
        var hsv = rgbToHsv(_value.r, _value.g, _value.b);
        onHsvChange(hsv);
    };
    var _b = color.rgb, r = _b.r, g = _b.g, b = _b.b;
    return (React.createElement(Input.Group, { className: prefixCls + "-input-group", compact: true },
        React.createElement(InputNumber, { size: "mini", min: 0, max: 255, hideControl: true, value: r, onChange: function (r) { return onInputChange({ r: r, g: g, b: b }); } }),
        React.createElement(InputNumber, { size: "mini", min: 0, max: 255, hideControl: true, value: g, onChange: function (g) { return onInputChange({ r: r, g: g, b: b }); } }),
        React.createElement(InputNumber, { size: "mini", min: 0, max: 255, hideControl: true, value: b, onChange: function (b) { return onInputChange({ r: r, g: g, b: b }); } }),
        !disabledAlpha && React.createElement(InputAlpha, { value: alpha, onChange: onAlphaChange })));
};
