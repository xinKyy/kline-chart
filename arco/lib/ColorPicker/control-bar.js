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
exports.ControlBar = void 0;
var react_1 = __importStar(require("react"));
var ConfigProvider_1 = require("../ConfigProvider");
var useControlBlock_1 = require("./hooks/useControlBlock");
var classNames_1 = __importDefault(require("../_util/classNames"));
var ControlBar = function (_a) {
    var x = _a.x, _b = _a.type, type = _b === void 0 ? 'hue' : _b, color = _a.color, colorString = _a.colorString, onChange = _a.onChange, style = _a.style;
    var getPrefixCls = (0, react_1.useContext)(ConfigProvider_1.ConfigContext).getPrefixCls;
    var prefixCls = getPrefixCls('color-picker');
    var _c = color.rgb, r = _c.r, g = _c.g, b = _c.b;
    var _d = (0, useControlBlock_1.useControlBlock)({
        value: [x, 0],
        onChange: function (pos) { return onChange(pos[0]); },
    }), blockRef = _d.blockRef, handlerRef = _d.handlerRef, onMouseDown = _d.onMouseDown;
    var renderHandler = function () {
        return (react_1.default.createElement("div", { ref: handlerRef, style: {
                left: x * 100 + "%",
            }, className: prefixCls + "-handler" },
            react_1.default.createElement("div", { className: prefixCls + "-handler-center", style: { backgroundColor: colorString } })));
    };
    if (type === 'alpha') {
        return (react_1.default.createElement("div", { className: prefixCls + "-control-bar-bg" },
            react_1.default.createElement("div", { ref: blockRef, className: (0, classNames_1.default)(prefixCls + "-control-bar", prefixCls + "-control-bar-alpha", prefixCls + "-control-bar-alpha"), style: __assign({ background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgb(" + r + ", " + g + ", " + b + "))" }, style), onMouseDown: onMouseDown }, renderHandler())));
    }
    return (react_1.default.createElement("div", { ref: blockRef, style: style, className: (0, classNames_1.default)(prefixCls + "-control-bar", prefixCls + "-control-bar-hue"), onMouseDown: onMouseDown }, renderHandler()));
};
exports.ControlBar = ControlBar;
