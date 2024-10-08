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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var ConfigProvider_1 = require("../ConfigProvider");
var context_1 = __importDefault(require("./context"));
var is_1 = require("../_util/is");
var defaultProps = {
    shape: 'circle',
    autoFixFontSize: true,
    triggerType: 'button',
};
var Avatar = (0, react_1.forwardRef)(function (props, ref) {
    var _a;
    var _b = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig, rtl = _b.rtl;
    var prefixCls = getPrefixCls('avatar');
    var contextProps = (0, react_1.useContext)(context_1.default);
    var mergedProps = __assign(__assign(__assign(__assign({}, defaultProps), componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Avatar), contextProps), props);
    var className = mergedProps.className, shape = mergedProps.shape, size = mergedProps.size, children = mergedProps.children, autoFixFontSize = mergedProps.autoFixFontSize, triggerIcon = mergedProps.triggerIcon, triggerIconStyle = mergedProps.triggerIconStyle, triggerType = mergedProps.triggerType, onClick = mergedProps.onClick, rest = __rest(mergedProps, ["className", "shape", "size", "children", "autoFixFontSize", "triggerIcon", "triggerIconStyle", "triggerType", "onClick"]);
    var style = __assign(__assign({}, contextProps.style), props.style);
    var textRef = (0, react_1.useRef)(null);
    var avatarRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (autoFixFontSize) {
            autoFixFontSizeHandler();
        }
    }, [size, children]);
    (0, react_1.useImperativeHandle)(ref, function () { return avatarRef.current; });
    // auto adjust font size
    function autoFixFontSizeHandler() {
        if (textRef.current) {
            var textWidth = textRef.current.clientWidth;
            var size_1 = props.size || avatarRef.current.offsetWidth;
            var scale = size_1 / (textWidth + 8);
            if (size_1 && scale < 1) {
                textRef.current.style.transform = "scale(" + scale + ") translateX(-50%)";
            }
        }
    }
    var classNames = (0, classNames_1.default)(prefixCls, prefixCls + "-" + shape, (_a = {},
        _a[prefixCls + "-with-trigger-icon"] = triggerIcon,
        _a[prefixCls + "-rtl"] = rtl,
        _a), className);
    var childrenList = react_1.default.Children.toArray(children);
    var isImage = childrenList.length === 1 &&
        react_1.default.isValidElement(childrenList[0]) &&
        (childrenList[0].type === 'img' || childrenList[0].type === 'picture');
    var _triggerIconStyle = triggerIconStyle || {};
    if (triggerType === 'button' &&
        (!triggerIconStyle || (triggerIconStyle && !triggerIconStyle.color)) &&
        style &&
        style.backgroundColor) {
        _triggerIconStyle.color = style.backgroundColor;
    }
    return (react_1.default.createElement("div", __assign({ ref: avatarRef, onClick: onClick }, rest, { style: __assign({ width: size, height: size, fontSize: (0, is_1.isNumber)(size) ? size / 2 : '' }, style), className: classNames }),
        isImage ? react_1.default.createElement("span", { className: prefixCls + "-image" }, children) : null,
        !isImage && (react_1.default.createElement("span", { ref: textRef, className: prefixCls + "-text" }, children)),
        triggerIcon && (react_1.default.createElement("div", { className: prefixCls + "-trigger-icon-" + triggerType, style: _triggerIconStyle }, triggerIcon))));
});
Avatar.displayName = 'Avatar';
exports.default = Avatar;
