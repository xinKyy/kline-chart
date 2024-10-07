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
import React, { useContext, useRef, useState, useImperativeHandle, useMemo, } from 'react';
import cs from '../_util/classNames';
import autoSizeTextAreaHeight from './autoSizeTextAreaHeight';
import omit from '../_util/omit';
import { ConfigContext } from '../ConfigProvider';
import { formatValue } from './input';
import useMergeValue from '../_util/hooks/useMergeValue';
import IconClose from '../../icon/react-icon/IconClose';
import IconHover from '../_class/icon-hover';
import { isObject } from '../_util/is';
import useIsomorphicLayoutEffect from '../_util/hooks/useIsomorphicLayoutEffect';
import useComposition from './useComposition';
var TextArea = function (props, ref) {
    var _a, _b, _c;
    var className = props.className, style = props.style, wrapperStyle = props.wrapperStyle, placeholder = props.placeholder, disabled = props.disabled, error = props.error, propMaxLength = props.maxLength, showWordLimit = props.showWordLimit, allowClear = props.allowClear, onChange = props.onChange, onClear = props.onClear, onKeyDown = props.onKeyDown, onPressEnter = props.onPressEnter, status = props.status, clearIcon = props.clearIcon, rest = __rest(props, ["className", "style", "wrapperStyle", "placeholder", "disabled", "error", "maxLength", "showWordLimit", "allowClear", "onChange", "onClear", "onKeyDown", "onPressEnter", "status", "clearIcon"]);
    // Only for error judgement
    var wordLimitMaxLength = isObject(propMaxLength) ? propMaxLength.length : propMaxLength;
    // The real maxLength passed to input element
    var maxLength = isObject(propMaxLength)
        ? propMaxLength.errorOnly
            ? undefined
            : propMaxLength.length
        : propMaxLength;
    var textareaRef = useRef();
    var _d = __read(useState({}), 2), textAreaStyle = _d[0], setTextAreaStyle = _d[1];
    var _e = __read(useMergeValue('', {
        defaultValue: 'defaultValue' in props ? formatValue(props.defaultValue, maxLength) : undefined,
        value: 'value' in props ? formatValue(props.value, maxLength) : undefined,
    }), 2), value = _e[0], setValue = _e[1];
    var _f = useComposition({
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
    var _g = useContext(ConfigContext), getPrefixCls = _g.getPrefixCls, rtl = _g.rtl;
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
        var textAreaStyle = autoSizeTextAreaHeight(props.autoSize, textareaRef.current);
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
    useIsomorphicLayoutEffect(function () {
        resizeTextAreaHeight();
    }, [textareaDisplayedText]);
    useImperativeHandle(ref, function () { return ({
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
    var lengthError = useMemo(function () {
        if (!maxLength && wordLimitMaxLength) {
            return valueLength > wordLimitMaxLength;
        }
        return false;
    }, [valueLength, wordLimitMaxLength, maxLength]);
    var inputStatus = status || (error || lengthError ? 'error' : undefined);
    var classNames = cs(prefixCls, (_a = {},
        _a[prefixCls + "-" + inputStatus] = inputStatus,
        // [`${prefixCls}-error`]: error || lengthError || status === 'error',
        _a[prefixCls + "-disabled"] = disabled,
        _a[prefixCls + "-rtl"] = rtl,
        _a), className);
    var TextAreaElement = (React.createElement("textarea", __assign({}, omit(rest, ['autoSize', 'defaultValue']), { maxLength: maxLength, ref: textareaRef, style: __assign(__assign({}, style), textAreaStyle), className: classNames, placeholder: placeholder, disabled: disabled, value: textareaDisplayedText, onChange: valueChangeHandler, onKeyDown: keyDownHandler, onCompositionStart: compositionHandler, onCompositionUpdate: compositionHandler, onCompositionEnd: compositionHandler })));
    if (withWrapper) {
        var showClearIcon = !disabled && allowClear && value;
        var _h = __read(rtl
            ? [wordLimitMaxLength, valueLength]
            : [valueLength, wordLimitMaxLength], 2), leftWord = _h[0], rightWord = _h[1];
        return (React.createElement("div", { className: cs(prefixCls + "-wrapper", (_b = {},
                _b[prefixCls + "-clear-wrapper"] = allowClear,
                _b[prefixCls + "-wrapper-rtl"] = rtl,
                _b)), style: wrapperStyle },
            TextAreaElement,
            showClearIcon ? (clearIcon !== undefined ? (React.createElement("span", { className: prefixCls + "-clear-icon", onClick: handleClearClick, onMouseDown: function (e) {
                    e.preventDefault();
                } }, clearIcon)) : (React.createElement(IconHover, { className: prefixCls + "-clear-icon" },
                React.createElement(IconClose, { onClick: handleClearClick, 
                    // keep focus status
                    onMouseDown: function (e) {
                        e.preventDefault();
                    } })))) : null,
            wordLimitMaxLength && showWordLimit && (React.createElement("span", { className: cs(prefixCls + "-word-limit", (_c = {},
                    _c[prefixCls + "-word-limit-error"] = lengthError,
                    _c)) },
                leftWord,
                "/",
                rightWord))));
    }
    return TextAreaElement;
};
var TextAreaRef = React.forwardRef(TextArea);
TextAreaRef.displayName = 'TextArea';
export default TextAreaRef;
