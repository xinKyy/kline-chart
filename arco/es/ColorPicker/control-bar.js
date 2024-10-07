var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useContext } from 'react';
import { ConfigContext } from '../ConfigProvider';
import { useControlBlock } from './hooks/useControlBlock';
import cs from '../_util/classNames';
export var ControlBar = function (_a) {
    var x = _a.x, _b = _a.type, type = _b === void 0 ? 'hue' : _b, color = _a.color, colorString = _a.colorString, onChange = _a.onChange, style = _a.style;
    var getPrefixCls = useContext(ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('color-picker');
    var _c = color.rgb, r = _c.r, g = _c.g, b = _c.b;
    var _d = useControlBlock({
        value: [x, 0],
        onChange: function (pos) { return onChange(pos[0]); },
    }), blockRef = _d.blockRef, handlerRef = _d.handlerRef, onMouseDown = _d.onMouseDown;
    var renderHandler = function () {
        return (React.createElement("div", { ref: handlerRef, style: {
                left: x * 100 + "%",
            }, className: prefixCls + "-handler" },
            React.createElement("div", { className: prefixCls + "-handler-center", style: { backgroundColor: colorString } })));
    };
    if (type === 'alpha') {
        return (React.createElement("div", { className: prefixCls + "-control-bar-bg" },
            React.createElement("div", { ref: blockRef, className: cs(prefixCls + "-control-bar", prefixCls + "-control-bar-alpha", prefixCls + "-control-bar-alpha"), style: __assign({ background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgb(" + r + ", " + g + ", " + b + "))" }, style), onMouseDown: onMouseDown }, renderHandler())));
    }
    return (React.createElement("div", { ref: blockRef, style: style, className: cs(prefixCls + "-control-bar", prefixCls + "-control-bar-hue"), onMouseDown: onMouseDown }, renderHandler()));
};
