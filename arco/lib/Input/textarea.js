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
var react_1 = __importStar(require("react"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var autoSizeTextAreaHeight_1 = __importDefault(require("./autoSizeTextAreaHeight"));
var omit_1 = __importDefault(require("../_util/omit"));
var ConfigProvider_1 = require("../ConfigProvider");
var input_1 = require("./input");
var useMergeValue_1 = __importDefault(require("../_util/hooks/useMergeValue"));
var IconClose_1 = __importDefault(require("../../icon/react-icon-cjs/IconClose"));
var icon_hover_1 = __importDefault(require("../_class/icon-hover"));
var is_1 = require("../_util/is");
var useIsomorphicLayoutEffect_1 = __importDefault(require("../_util/hooks/useIsomorphicLayoutEffect"));
var useComposition_1 = __importDefault(require("./useComposition"));
var TextArea = function (props, ref) {
    var _a, _b, _c;
    var className = props.className, style = props.style, wrapperStyle = props.wrapperStyle, placeholder = props.placeholder, disabled = props.disabled, error = props.error, propMaxLength = props.maxLength, showWordLimit = props.showWordLimit, allowClear = props.allowClear, onChange = props.onChange, onClear = props.onClear, onKeyDown = props.onKeyDown, onPressEnter = props.onPressEnter, status = props.status, clearIcon = props.clearIcon, rest = __rest(props, ["className", "style", "wrapperStyle", "placeholder", "disabled", "error", "maxLength", "showWordLimit", "allowClear", "onChange", "onClear", "onKeyDown", "onPressEnter", "status", "clearIcon"]);
    // Only for error judgement
    var wordLimitMaxLength = (0, is_1.isObject)(propMaxLength) ? propMaxLength.length : propMaxLength;
    // The real maxLength passed to input element
    var maxLength = (0, is_1.isObject)(propMaxLength)
        ? propMaxLength.errorOnly
            ? undefined
            : propMaxLength.length
        : propMaxLength;
    var textareaRef = (0, react_1.useRef)();
    var _d = __read((0, react_1.useState)({}), 2), textAreaStyle = _d[0], setTextAreaStyle = _d[1];
    var _e = __read((0, useMergeValue_1.default)('', {
        defaultValue: 'defaultValue' in props ? (0, input_1.formatValue)(props.defaultValue, maxLength) : undefined,
        value: 'value' in props ? (0, input_1.formatValue)(props.value, maxLength) : undefined,
    }), 2), value = _e[0], setValue = _e[1];
    var _f = (0, useComposition_1.default)({
        value: value,
        maxLength: maxLength,
        onChange: onChange,
        onKeyDown: onKeyDown,
        onPressEnter: onPressEnter,
        beforeTriggerValueChangeCallback: function (v) {
            if (!('value' in props) && (maxLength === undefined || v.length <= maxLength)) {
                setValue(v);
            }
        },
    }), compositionValue = _f.compositionValue, compositionHandler = _f.compositionHandler, valueChangeHandler = _f.valueChangeHandler, keyDownHandler = _f.keyDownHandler, triggerValueChangeCallback = _f.triggerValueChangeCallback;
    var textareaDisplayedText = compositionValue || value || '';
    var _g = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _g.getPrefixCls, rtl = _g.rtl;
    var prefixCls = getPrefixCls('textarea');
    if (disabled) {
        textAreaStyle.resize = 'none';
    }
    // set element focus and caret position
    var onFocus = function () {
        if (textareaRef.current && textareaRef.current.focus) {
            if (textareaRef.current.setSelectionRange) {
                var caretPos = textareaRef.current.textContent.length;
                // reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
                textareaRef.current.setSelectionRange(caretPos, caretPos);
            }
            textareaRef.current.focus();
        }
    };
    var resizeTextAreaHeight = function () {
        var textAreaStyle = (0, autoSizeTextAreaHeight_1.default)(props.autoSize, textareaRef.current);
        if (textAreaStyle) {
            setTextAreaStyle(textAreaStyle);
        }
    };
    var handleClearClick = function (e) {
        e.stopPropagation();
        onFocus();
        triggerValueChangeCallback('', e);
        onClear === null || onClear === void 0 ? void 0 : onClear();
    };
    (0, useIsomorphicLayoutEffect_1.default)(function () {
        resizeTextAreaHeight();
    }, [textareaDisplayedText]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        dom: textareaRef.current,
        focus: function () {
            onFocus();
        },
        blur: function () {
            textareaRef.current && textareaRef.current.blur && textareaRef.current.blur();
        },
    }); }, []);
    var valueLength = value ? value.length : 0;
    var withWrapper = (wordLimitMaxLength && showWordLimit) || allowClear;
    var lengthError = (0, react_1.useMemo)(function () {
        if (!maxLength && wordLimitMaxLength) {
            return valueLength > wordLimitMaxLength;
        }
        return false;
    }, [valueLength, wordLimitMaxLength, maxLength]);
    var inputStatus = status || (error || lengthError ? 'error' : undefined);
    var classNames = (0, classNames_1.default)(prefixCls, (_a = {},
        _a[prefixCls + "-" + inputStatus] = inputStatus,
        // [`${prefixCls}-error`]: error || lengthError || status === 'error',
        _a[prefixCls + "-disabled"] = disabled,
        _a[prefixCls + "-rtl"] = rtl,
        _a), className);
    var TextAreaElement = (react_1.default.createElement("textarea", __assign({}, (0, omit_1.default)(rest, ['autoSize', 'defaultValue']), { maxLength: maxLength, ref: textareaRef, style: __assign(__assign({}, style), textAreaStyle), className: classNames, placeholder: placeholder, disabled: disabled, value: textareaDisplayedText, onChange: valueChangeHandler, onKeyDown: keyDownHandler, onCompositionStart: compositionHandler, onCompositionUpdate: compositionHandler, onCompositionEnd: compositionHandler })));
    if (withWrapper) {
        var showClearIcon = !disabled && allowClear && value;
        var _h = __read(rtl
            ? [wordLimitMaxLength, valueLength]
            : [valueLength, wordLimitMaxLength], 2), leftWord = _h[0], rightWord = _h[1];
        return (react_1.default.createElement("div", { className: (0, classNames_1.default)(prefixCls + "-wrapper", (_b = {},
                _b[prefixCls + "-clear-wrapper"] = allowClear,
                _b[prefixCls + "-wrapper-rtl"] = rtl,
                _b)), style: wrapperStyle },
            TextAreaElement,
            showClearIcon ? (clearIcon !== undefined ? (react_1.default.createElement("span", { className: prefixCls + "-clear-icon", onClick: handleClearClick, onMouseDown: function (e) {
                    e.preventDefault();
                } }, clearIcon)) : (react_1.default.createElement(icon_hover_1.default, { className: prefixCls + "-clear-icon" },
                react_1.default.createElement(IconClose_1.default, { onClick: handleClearClick, 
                    // keep focus status
                    onMouseDown: function (e) {
                        e.preventDefault();
                    } })))) : null,
            wordLimitMaxLength && showWordLimit && (react_1.default.createElement("span", { className: (0, classNames_1.default)(prefixCls + "-word-limit", (_c = {},
                    _c[prefixCls + "-word-limit-error"] = lengthError,
                    _c)) },
                leftWord,
                "/",
                rightWord))));
    }
    return TextAreaElement;
};
var TextAreaRef = react_1.default.forwardRef(TextArea);
TextAreaRef.displayName = 'TextArea';
exports.default = TextAreaRef;
