"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
var react_1 = __importStar(require("react"));
var control_bar_1 = require("./control-bar");
var ConfigProvider_1 = require("../ConfigProvider");
var palette_1 = require("./palette");
var Select_1 = __importDefault(require("../Select"));
var input_rgb_1 = require("./input-rgb");
var input_hex_1 = require("./input-hex");
var color_1 = require("../_util/color");
var Panel = function (_a) {
    var color = _a.color, alpha = _a.alpha, disabledAlpha = _a.disabledAlpha, colorString = _a.colorString, historyColors = _a.historyColors, presetColors = _a.presetColors, showHistory = _a.showHistory, showPreset = _a.showPreset, renderPreset = _a.renderPreset, renderHistory = _a.renderHistory, renderPickSection = _a.renderPickSection, onHsvChange = _a.onHsvChange, onAlphaChange = _a.onAlphaChange;
    var _b = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _b.getPrefixCls, locale = _b.locale;
    var prefixCls = getPrefixCls('color-picker');
    var _c = __read((0, react_1.useState)('hex'), 2), format = _c[0], setFormat = _c[1];
    var _d = color.hsv, h = _d.h, s = _d.s, v = _d.v;
    var history = (0, react_1.useMemo)(function () {
        var set = new Set(historyColors !== null && historyColors !== void 0 ? historyColors : []);
        return Array.from(set);
    }, [historyColors]);
    var onHexInputChange = function (_value) {
        var _rgb = (0, color_1.hexToRgb)(_value) || {
            r: 255,
            g: 0,
            b: 0,
        };
        var _hsv = (0, color_1.rgbToHsv)(_rgb.r, _rgb.g, _rgb.b);
        onHsvChange(_hsv);
    };
    var renderInput = function () {
        if (format === 'rgb') {
            return (react_1.default.createElement(input_rgb_1.InputRgb, { color: color, alpha: alpha, onHsvChange: onHsvChange, onAlphaChange: onAlphaChange, disabledAlpha: disabledAlpha }));
        }
        return (react_1.default.createElement(input_hex_1.InputHex, { color: color, alpha: alpha, onHsvChange: onHsvChange, onAlphaChange: onAlphaChange, disabledAlpha: disabledAlpha }));
    };
    var renderColorBlock = function (color) {
        return (react_1.default.createElement("div", { key: color, className: prefixCls + "-color-block", onClick: function () {
                onHexInputChange(color);
            } },
            react_1.default.createElement("div", { className: prefixCls + "-block", style: { backgroundColor: color } })));
    };
    var renderHistorySec = function () {
        if (renderHistory) {
            return renderHistory();
        }
        if (showHistory) {
            return (react_1.default.createElement("div", { className: prefixCls + "-colors-section" },
                react_1.default.createElement("div", { className: prefixCls + "-colors-text" }, locale.ColorPicker.history),
                react_1.default.createElement("div", { className: prefixCls + "-colors-wrapper" }, (history === null || history === void 0 ? void 0 : history.length) ? (react_1.default.createElement("div", { className: prefixCls + "-colors-list" }, history.map(renderColorBlock))) : (react_1.default.createElement("span", { className: prefixCls + "-colors-empty" }, locale.ColorPicker.empty)))));
        }
        return null;
    };
    var renderPresetSec = function () {
        if (renderPreset) {
            return renderPreset();
        }
        if (showPreset) {
            return (react_1.default.createElement("div", { className: prefixCls + "-colors-section" },
                react_1.default.createElement("div", { className: prefixCls + "-colors-text" }, locale.ColorPicker.preset),
                react_1.default.createElement("div", { className: prefixCls + "-colors-wrapper" },
                    react_1.default.createElement("div", { className: prefixCls + "-colors-list" }, presetColors === null || presetColors === void 0 ? void 0 : presetColors.map(renderColorBlock)))));
        }
        return null;
    };
    var renderColorSec = function () {
        if (renderPickSection) {
            return renderPickSection();
        }
        if (showHistory || showPreset) {
            return (react_1.default.createElement("div", { className: prefixCls + "-panel-colors" },
                renderHistorySec(),
                renderPresetSec()));
        }
        return null;
    };
    return (react_1.default.createElement("div", { className: prefixCls + "-panel" },
        react_1.default.createElement(palette_1.Palette, { color: color, onChange: function (s, v) { return onHsvChange({ h: h, s: s, v: v }); } }),
        react_1.default.createElement("div", { className: prefixCls + "-panel-control" },
            react_1.default.createElement("div", { className: prefixCls + "-control-wrapper" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(control_bar_1.ControlBar, { type: "hue", x: h, color: color, colorString: colorString, onChange: function (h) { return onHsvChange({ h: h, s: s, v: v }); } }),
                    !disabledAlpha && (react_1.default.createElement(control_bar_1.ControlBar, { type: "alpha", x: alpha, color: color, colorString: colorString, onChange: onAlphaChange }))),
                react_1.default.createElement("div", { className: prefixCls + "-preview", style: { backgroundColor: colorString } })),
            react_1.default.createElement("div", { className: prefixCls + "-input-wrapper" },
                react_1.default.createElement(Select_1.default, { className: prefixCls + "-select-type", size: "mini", options: [
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
                react_1.default.createElement("div", { className: prefixCls + "-group-wrapper" }, renderInput()))),
        renderColorSec()));
};
exports.Panel = Panel;
