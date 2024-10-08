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
import React, { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import IconUp from '../../icon/react-icon/IconUp';
import IconDown from '../../icon/react-icon/IconDown';
import IconPlus from '../../icon/react-icon/IconPlus';
import IconMinus from '../../icon/react-icon/IconMinus';
import { isNumber } from '../_util/is';
import cs from '../_util/classNames';
import { ArrowUp, ArrowDown } from '../_util/keycode';
import { ConfigContext } from '../ConfigProvider';
import Input from '../Input';
import useMergeProps from '../_util/hooks/useMergeProps';
import omit from '../_util/omit';
import useSelectionRange from './useSelectionRange';
import { getDecimal } from './Decimal';
// Value's auto change speed when user holds on plus or minus
var AUTO_CHANGE_INTERVAL = 200;
// Delay to auto change value when user holds on plus or minus
var AUTO_CHANGE_START_DELAY = 1000;
var defaultProps = {
    max: Infinity,
    min: -Infinity,
    step: 1,
    mode: 'embed',
    parser: function (input) { return (input === null || input === void 0 ? void 0 : input.replace(/[^\w\.-]+/g, '')) || ''; },
};
function InputNumber(baseProps, ref) {
    var _a;
    var _b;
    var _c = useContext(ConfigContext), getPrefixCls = _c.getPrefixCls, ctxSize = _c.size, componentConfig = _c.componentConfig, rtl = _c.rtl;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.InputNumber);
    var className = props.className, style = props.style, defaultValue = props.defaultValue, disabled = props.disabled, error = props.error, readOnly = props.readOnly, strictMode = props.strictMode, placeholder = props.placeholder, hideControl = props.hideControl, suffix = props.suffix, prefix = props.prefix, icons = props.icons, mode = props.mode, size = props.size, step = props.step, precision = props.precision, min = props.min, max = props.max, parser = props.parser, formatter = props.formatter, onBlur = props.onBlur, onFocus = props.onFocus, onChange = props.onChange, onKeyDown = props.onKeyDown, rest = __rest(props, ["className", "style", "defaultValue", "disabled", "error", "readOnly", "strictMode", "placeholder", "hideControl", "suffix", "prefix", "icons", "mode", "size", "step", "precision", "min", "max", "parser", "formatter", "onBlur", "onFocus", "onChange", "onKeyDown"]);
    var prefixCls = getPrefixCls('input-number');
    var mergedSize = size || ctxSize;
    var mergedPrecision = (function () {
        if (isNumber(precision)) {
            var decimal = ("" + step).split('.')[1];
            var stepPrecision = (decimal && decimal.length) || 0;
            return Math.max(stepPrecision, precision);
        }
        return null;
    })();
    var _d = __read(useState(function () {
        return getDecimal('value' in props ? props.value : 'defaultValue' in props ? defaultValue : undefined);
    }), 2), innerValue = _d[0], setInnerValue = _d[1];
    var _e = __read(useState(''), 2), inputValue = _e[0], setInputValue = _e[1];
    var _f = __read(useState(false), 2), isOutOfRange = _f[0], setIsOutOfRange = _f[1];
    var _g = __read(useState(false), 2), isUserTyping = _g[0], setIsUserTyping = _g[1];
    var refAutoTimer = useRef(null);
    var refInput = useRef(null);
    // Ref to keep track of whether user has taken operations since the last change of prop value
    var refHasOperateSincePropValueChanged = useRef(false);
    var value = useMemo(function () {
        return 'value' in props ? getDecimal(props.value) : innerValue;
    }, [props.value, innerValue]);
    var _h = __read(useMemo(function () {
        return [getDecimal(max), getDecimal(min)];
    }, [max, min]), 2), maxDecimal = _h[0], minDecimal = _h[1];
    useImperativeHandle(ref, function () { return refInput.current; }, []);
    var setValue = function (newValue, reason) {
        setInnerValue(newValue);
        if (!newValue.equals(value) && onChange) {
            var newValueStr = newValue.toString({ safe: true, precision: mergedPrecision });
            onChange(newValue.isEmpty
                ? undefined
                : strictMode
                    ? newValueStr
                    : newValue.isNaN
                        ? NaN
                        : Number(newValueStr), reason);
        }
    };
    var stop = function () {
        refAutoTimer.current && clearTimeout(refAutoTimer.current);
        refAutoTimer.current = null;
    };
    var getLegalValue = useCallback(function (changedValue) {
        var finalValue = changedValue;
        if (finalValue.less(minDecimal)) {
            finalValue = minDecimal;
        }
        else if (maxDecimal.less(finalValue)) {
            finalValue = maxDecimal;
        }
        return finalValue;
    }, [minDecimal, maxDecimal]);
    useEffect(function () {
        return function () { return stop(); };
    }, []);
    useEffect(function () {
        refHasOperateSincePropValueChanged.current = false;
    }, [props.value]);
    useEffect(function () {
        var _isOutOfRange = value.less(minDecimal) || maxDecimal.less(value);
        // Don't correct the illegal value caused by prop value. Wait for user to take actions.
        if (_isOutOfRange && refHasOperateSincePropValueChanged.current) {
            setValue(getLegalValue(value), 'outOfRange');
        }
        setIsOutOfRange(_isOutOfRange);
    }, [minDecimal, maxDecimal, value, getLegalValue]);
    var handleArrowKey = function (event, method, needRepeat) {
        if (needRepeat === void 0) { needRepeat = false; }
        event.persist();
        event.preventDefault();
        setIsUserTyping(false);
        if (disabled || readOnly) {
            return;
        }
        var finalValue = value.isInvalid
            ? getDecimal(min === -Infinity || (min <= 0 && max >= 0) ? 0 : min)
            : value.add(method === 'plus' ? step : -step);
        setValue(getLegalValue(finalValue), method === 'plus' ? 'increase' : 'decrease');
        refInput.current && refInput.current.focus();
        // auto change while holding
        if (needRepeat) {
            var isFirstRepeat = refAutoTimer.current === null;
            refAutoTimer.current = setTimeout(function () { return event.target.dispatchEvent(event.nativeEvent); }, isFirstRepeat ? AUTO_CHANGE_START_DELAY : AUTO_CHANGE_INTERVAL);
        }
    };
    var displayedInputValue = useMemo(function () {
        var _value;
        if (isUserTyping) {
            _value = parser ? "" + parser(inputValue) : inputValue;
        }
        else if (isNumber(mergedPrecision)) {
            _value = value.toString({ safe: true, precision: mergedPrecision });
        }
        else if (value.isInvalid) {
            _value = '';
        }
        else {
            _value = value.toString();
        }
        return formatter ? formatter(_value, { userTyping: isUserTyping, input: inputValue }) : _value;
    }, [value, inputValue, isUserTyping, mergedPrecision, parser, formatter]);
    var updateSelectionRangePosition = useSelectionRange({
        inputElement: (_b = refInput.current) === null || _b === void 0 ? void 0 : _b.dom,
        inputValue: displayedInputValue,
    });
    var inputEventHandlers = {
        onChange: function (rawText, event) {
            setIsUserTyping(true);
            rawText = rawText.trim().replace(/。/g, '.');
            var parsedValue = parser ? parser(rawText) : rawText;
            if (isNumber(+parsedValue) || parsedValue === '-' || !parsedValue || parsedValue === '.') {
                setInputValue(rawText);
                setValue(getLegalValue(getDecimal(parsedValue)), 'manual');
                updateSelectionRangePosition(event);
            }
        },
        onKeyDown: function (e) {
            var key = e.key;
            if (key === ArrowDown.key) {
                e.stopPropagation();
                handleArrowKey(e, 'minus');
            }
            else if (key === ArrowUp.key) {
                e.stopPropagation();
                handleArrowKey(e, 'plus');
            }
            stop();
            onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
        },
        onFocus: function (e) {
            var _a, _b;
            // Both tab and button click trigger focus event. This can be used to determine whether user has taken operations
            refHasOperateSincePropValueChanged.current = true;
            setInputValue((_b = (_a = refInput.current) === null || _a === void 0 ? void 0 : _a.dom) === null || _b === void 0 ? void 0 : _b.value);
            onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
        },
        onBlur: function (e) {
            setValue(getLegalValue(value), 'outOfRange');
            setIsUserTyping(false);
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
        },
    };
    var getControlButtonEventsHandlers = function (method) {
        return readOnly
            ? {}
            : {
                onMouseDown: function (e) { return handleArrowKey(e, method, true); },
            };
    };
    var shouldRenderButton = !hideControl && mode === 'button';
    var shouldRenderLayer = !hideControl && !readOnly && mode === 'embed';
    var renderStepButton = function (method, icon) {
        var _a;
        var isStepButtonValid = !disabled &&
            (value.isInvalid ||
                (method === 'plus'
                    ? maxDecimal.isInvalid || value.less(maxDecimal)
                    : minDecimal.isInvalid || minDecimal.less(value)));
        return (React.createElement("div", __assign({ className: cs(prefixCls + "-step-button", (_a = {},
                _a[prefixCls + "-step-button-disabled"] = !isStepButtonValid,
                _a)), onMouseLeave: stop, onMouseUp: stop }, (isStepButtonValid ? getControlButtonEventsHandlers(method) : {})), icon));
    };
    return (React.createElement(Input, __assign({ _ignorePropsFromGlobal: true, role: "spinbutton", "aria-valuemax": max, "aria-valuemin": min, "aria-valuenow": value.isEmpty ? undefined : value.toNumber() }, omit(rest, ['allowClear']), inputEventHandlers, { style: style, className: cs(prefixCls, prefixCls + "-mode-" + mode, prefixCls + "-size-" + mergedSize, (_a = {},
            _a[prefixCls + "-rtl"] = rtl,
            _a[prefixCls + "-readonly"] = readOnly,
            _a[prefixCls + "-illegal-value"] = !value.isEmpty && isOutOfRange,
            _a), className), ref: refInput, size: mergedSize, error: error, disabled: disabled, readOnly: readOnly, value: displayedInputValue, placeholder: placeholder, prefix: prefix && React.createElement("div", { className: prefixCls + "-prefix" }, prefix), suffix: React.createElement(React.Fragment, null,
            shouldRenderLayer && (React.createElement("div", { className: prefixCls + "-step-layer" },
                renderStepButton('plus', icons && icons.up ? icons.up : React.createElement(IconUp, null)),
                renderStepButton('minus', icons && icons.down ? icons.down : React.createElement(IconDown, null)))),
            suffix && React.createElement("div", { className: prefixCls + "-suffix" }, suffix)), addBefore: shouldRenderButton &&
            renderStepButton('minus', icons && icons.minus ? icons.minus : React.createElement(IconMinus, null)), addAfter: shouldRenderButton &&
            renderStepButton('plus', icons && icons.plus ? icons.plus : React.createElement(IconPlus, null)) })));
}
var InputNumberComponent = React.forwardRef(InputNumber);
InputNumberComponent.displayName = 'InputNumber';
export default InputNumberComponent;
