var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useContext, useMemo, useState } from 'react';
import { ControlBar } from './control-bar';
import { ConfigContext } from '../ConfigProvider';
import { Palette } from './palette';
import Select from '../Select';
import { InputRgb } from './input-rgb';
import { InputHex } from './input-hex';
import { hexToRgb, rgbToHsv } from '../_util/color';
export var Panel = function (_a) {
    var color = _a.color, alpha = _a.alpha, disabledAlpha = _a.disabledAlpha, colorString = _a.colorString, historyColors = _a.historyColors, presetColors = _a.presetColors, showHistory = _a.showHistory, showPreset = _a.showPreset, renderPreset = _a.renderPreset, renderHistory = _a.renderHistory, renderPickSection = _a.renderPickSection, onHsvChange = _a.onHsvChange, onAlphaChange = _a.onAlphaChange;
    var _b = useContext(ConfigContext), getPrefixCls = _b.getPrefixCls, locale = _b.locale;
    var prefixCls = getPrefixCls('color-picker');
    var _c = __read(useState('hex'), 2), format = _c[0], setFormat = _c[1];
    var _d = color.hsv, h = _d.h, s = _d.s, v = _d.v;
    var history = useMemo(function () {
        var set = new Set(historyColors !== null && historyColors !== void 0 ? historyColors : []);
        return Array.from(set);
    }, [historyColors]);
    var onHexInputChange = function (_value) {
        var _rgb = hexToRgb(_value) || {
            r: 255,
            g: 0,
            b: 0,
        };
        var _hsv = rgbToHsv(_rgb.r, _rgb.g, _rgb.b);
        onHsvChange(_hsv);
    };
    var renderInput = function () {
        if (format === 'rgb') {
            return (React.createElement(InputRgb, { color: color, alpha: alpha, onHsvChange: onHsvChange, onAlphaChange: onAlphaChange, disabledAlpha: disabledAlpha }));
        }
        return (React.createElement(InputHex, { color: color, alpha: alpha, onHsvChange: onHsvChange, onAlphaChange: onAlphaChange, disabledAlpha: disabledAlpha }));
    };
    var renderColorBlock = function (color) {
        return (React.createElement("div", { key: color, className: prefixCls + "-color-block", onClick: function () {
                onHexInputChange(color);
            } },
            React.createElement("div", { className: prefixCls + "-block", style: { backgroundColor: color } })));
    };
    var renderHistorySec = function () {
        if (renderHistory) {
            return renderHistory();
        }
        if (showHistory) {
            return (React.createElement("div", { className: prefixCls + "-colors-section" },
                React.createElement("div", { className: prefixCls + "-colors-text" }, locale.ColorPicker.history),
                React.createElement("div", { className: prefixCls + "-colors-wrapper" }, (history === null || history === void 0 ? void 0 : history.length) ? (React.createElement("div", { className: prefixCls + "-colors-list" }, history.map(renderColorBlock))) : (React.createElement("span", { className: prefixCls + "-colors-empty" }, locale.ColorPicker.empty)))));
        }
        return null;
    };
    var renderPresetSec = function () {
        if (renderPreset) {
            return renderPreset();
        }
        if (showPreset) {
            return (React.createElement("div", { className: prefixCls + "-colors-section" },
                React.createElement("div", { className: prefixCls + "-colors-text" }, locale.ColorPicker.preset),
                React.createElement("div", { className: prefixCls + "-colors-wrapper" },
                    React.createElement("div", { className: prefixCls + "-colors-list" }, presetColors === null || presetColors === void 0 ? void 0 : presetColors.map(renderColorBlock)))));
        }
        return null;
    };
    var renderColorSec = function () {
        if (renderPickSection) {
            return renderPickSection();
        }
        if (showHistory || showPreset) {
            return (React.createElement("div", { className: prefixCls + "-panel-colors" },
                renderHistorySec(),
                renderPresetSec()));
        }
        return null;
    };
    return (React.createElement("div", { className: prefixCls + "-panel" },
        React.createElement(Palette, { color: color, onChange: function (s, v) { return onHsvChange({ h: h, s: s, v: v }); } }),
        React.createElement("div", { className: prefixCls + "-panel-control" },
            React.createElement("div", { className: prefixCls + "-control-wrapper" },
                React.createElement("div", null,
                    React.createElement(ControlBar, { type: "hue", x: h, color: color, colorString: colorString, onChange: function (h) { return onHsvChange({ h: h, s: s, v: v }); } }),
                    !disabledAlpha && (React.createElement(ControlBar, { type: "alpha", x: alpha, color: color, colorString: colorString, onChange: onAlphaChange }))),
                React.createElement("div", { className: prefixCls + "-preview", style: { backgroundColor: colorString } })),
            React.createElement("div", { className: prefixCls + "-input-wrapper" },
                React.createElement(Select, { className: prefixCls + "-select-type", size: "mini", options: [
                        {
                            value: 'hex',
                            label: 'Hex',
                        },
                        {
                            value: 'rgb',
                            label: 'RGB',
                        },
                    ], value: format, triggerProps: {
                        className: prefixCls + "-type-dropdown",
                    }, onChange: setFormat }),
                React.createElement("div", { className: prefixCls + "-group-wrapper" }, renderInput()))),
        renderColorSec()));
};
