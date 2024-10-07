"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var ConfigProvider_1 = require("../ConfigProvider");
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var panel_1 = require("./panel");
var classNames_1 = __importDefault(require("../_util/classNames"));
var Trigger_1 = __importDefault(require("../Trigger"));
var colors_1 = require("./colors");
var useColorPicker_1 = require("./hooks/useColorPicker");
var is_1 = require("../_util/is");
var defaultProps = {
    size: 'default',
    presetColors: colors_1.colors,
};
function ColorPicker(baseProps, ref) {
    var _a = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _a.getPrefixCls, componentConfig = _a.componentConfig;
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.ColorPicker);
    var style = props.style, className = props.className, size = props.size, disabled = props.disabled, _b = props.disabledAlpha, disabledAlpha = _b === void 0 ? false : _b, _c = props.triggerProps, triggerProps = _c === void 0 ? {} : _c, unmountOnExit = props.unmountOnExit, showText = props.showText, historyColors = props.historyColors, presetColors = props.presetColors, showHistory = props.showHistory, showPreset = props.showPreset;
    var prefixCls = getPrefixCls('color-picker');
    var _d = (0, useColorPicker_1.useColorPicker)(props), value = _d.value, popupVisible = _d.popupVisible, color = _d.color, alpha = _d.alpha, colorString = _d.colorString, onHsvChange = _d.onHsvChange, onAlphaChange = _d.onAlphaChange, onVisibleChange = _d.onVisibleChange;
    var renderInput = function () {
        var _a;
        var customTriggerElement = (0, is_1.isFunction)(baseProps.triggerElement)
            ? baseProps.triggerElement({ value: value })
            : baseProps.triggerElement;
        if (!(0, is_1.isNullOrUndefined)(customTriggerElement)) {
            return customTriggerElement;
        }
        return (react_1.default.createElement("div", { className: (0, classNames_1.default)(prefixCls, className, (_a = {},
                _a[prefixCls + "-size-" + size] = size,
                _a[prefixCls + "-disabled"] = disabled,
                _a)), style: style, ref: ref },
            react_1.default.createElement("div", { className: prefixCls + "-preview", style: { backgroundColor: value } }),
            Boolean(showText) && react_1.default.createElement("div", { className: prefixCls + "-value" }, value),
            react_1.default.createElement("input", { className: prefixCls + "-input", value: value, disabled: disabled, readOnly: true })));
    };
    var renderPanel = function () {
        return (react_1.default.createElement(panel_1.Panel, { color: color, alpha: alpha, colorString: colorString, historyColors: historyColors, presetColors: presetColors, showHistory: showHistory, showPreset: showPreset, onHsvChange: onHsvChange, onAlphaChange: onAlphaChange, disabledAlpha: disabledAlpha }));
    };
    return (react_1.default.createElement(Trigger_1.default, __assign({ popup: renderPanel, trigger: "click", position: "bl", popupAlign: {
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
        }, disabled: disabled, popupVisible: popupVisible, classNames: "slideDynamicOrigin", unmountOnExit: unmountOnExit }, triggerProps, { onVisibleChange: onVisibleChange }), renderInput()));
}
var ColorPickerComponent = react_1.default.forwardRef(ColorPicker);
ColorPickerComponent.displayName = 'ColorPicker';
exports.default = ColorPickerComponent;
