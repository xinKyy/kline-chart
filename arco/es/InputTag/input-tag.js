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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useContext, useState, useRef, useImperativeHandle, useEffect, } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ConfigContext } from '../ConfigProvider';
import Tag from '../Tag';
import Popover from '../Popover';
import useMergeValue from '../_util/hooks/useMergeValue';
import cs from '../_util/classNames';
import InputComponent from '../Input/input-element';
import IconHover from '../_class/icon-hover';
import IconClose from '../../icon/react-icon/IconClose';
import { isObject, isArray } from '../_util/is';
import getHotkeyHandler from '../_util/getHotkeyHandler';
import { Backspace } from '../_util/keycode';
import useMergeProps from '../_util/hooks/useMergeProps';
import Draggable from '../_class/Draggable';
import omit from '../_util/omit';
import fillNBSP from '../_util/fillNBSP';
var CSS_TRANSITION_DURATION = 300;
var REACT_KEY_FOR_INPUT = "__input_" + Math.random().toFixed(10).slice(2);
var isEmptyNode = function (node) {
    return node === null || node === undefined;
};
var keepFocus = function (e) {
    e.target.tagName !== 'INPUT' && e.preventDefault();
};
var formatValue = function (value) {
    if (!isArray(value)) {
        return [];
    }
    return value.map(function (item) {
        return isObject(item)
            ? __assign(__assign({}, item), { label: 'label' in item ? item.label : item.value, value: item.value, closable: item.closable }) : {
            label: item,
            value: item,
        };
    });
};
// Deal with the delay of recomputing input width
var useComputeAutoWidthDelay = function (value) {
    var refDelay = useRef(0);
    var refPrevValueLength = useRef(value.length);
    useEffect(function () {
        refDelay.current =
            value.length === 0 && refPrevValueLength.current > 0 ? CSS_TRANSITION_DURATION : 0;
        refPrevValueLength.current = value.length;
    }, [value]);
    return refDelay;
};
var UsedTransitionGroup = function (_a) {
    var prefixCls = _a.prefixCls, children = _a.children, animation = _a.animation;
    return animation ? (React.createElement(TransitionGroup, { component: "div", className: prefixCls + "-inner" }, children)) : (React.createElement("div", { className: prefixCls + "-inner" }, children));
};
var defaultProps = {
    animation: true,
    validate: function (inputValue, values) { return inputValue && values.every(function (item) { return item.value !== inputValue; }); },
};
function InputTag(baseProps, ref) {
    var _a, _b;
    var _this = this;
    var _c = useContext(ConfigContext), getPrefixCls = _c.getPrefixCls, ctxSize = _c.size, componentConfig = _c.componentConfig, rtl = _c.rtl;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.InputTag);
    var className = props.className, style = props.style, placeholder = props.placeholder, error = props.error, disabled = props.disabled, readOnly = props.readOnly, allowClear = props.allowClear, autoFocus = props.autoFocus, labelInValue = props.labelInValue, disableInput = props.disableInput, animation = props.animation, saveOnBlur = props.saveOnBlur, dragToSort = props.dragToSort, icon = props.icon, prefix = props.prefix, suffix = props.suffix, addBefore = props.addBefore, addAfter = props.addAfter, tokenSeparators = props.tokenSeparators, validate = props.validate, renderTag = props.renderTag, tagClassName = props.tagClassName, maxTagCount = props.maxTagCount, onInputChange = props.onInputChange, onKeyDown = props.onKeyDown, onPaste = props.onPaste, onChange = props.onChange, onFocus = props.onFocus, onBlur = props.onBlur, onPressEnter = props.onPressEnter, onRemove = props.onRemove, onClear = props.onClear, onClick = props.onClick, rest = __rest(props, ["className", "style", "placeholder", "error", "disabled", "readOnly", "allowClear", "autoFocus", "labelInValue", "disableInput", "animation", "saveOnBlur", "dragToSort", "icon", "prefix", "suffix", "addBefore", "addAfter", "tokenSeparators", "validate", "renderTag", "tagClassName", "maxTagCount", "onInputChange", "onKeyDown", "onPaste", "onChange", "onFocus", "onBlur", "onPressEnter", "onRemove", "onClear", "onClick"]);
    var prefixCls = getPrefixCls('input-tag');
    var size = 'size' in props ? props.size : ctxSize;
    var refInput = useRef();
    var refTSLastSeparateTriggered = useRef(null);
    var _d = __read(useState(false), 2), focused = _d[0], setFocused = _d[1];
    var _e = __read(useMergeValue([], {
        defaultValue: 'defaultValue' in props ? formatValue(props.defaultValue) : undefined,
        value: 'value' in props ? formatValue(props.value) : undefined,
    }), 2), value = _e[0], setValue = _e[1];
    var _f = __read(useMergeValue('', {
        value: props.inputValue,
    }), 2), inputValue = _f[0], setInputValue = _f[1];
    var refDelay = useComputeAutoWidthDelay(value);
    var draggable = !!(dragToSort && !readOnly && !disabled);
    useImperativeHandle(ref, function () {
        var _a, _b;
        return {
            blur: (_a = refInput.current) === null || _a === void 0 ? void 0 : _a.blur,
            focus: (_b = refInput.current) === null || _b === void 0 ? void 0 : _b.focus,
        };
    }, []);
    var valueChangeHandler = function (value, reason) {
        if (disabled || readOnly) {
            return;
        }
        if (!('value' in props)) {
            setValue(value);
        }
        onChange && onChange(labelInValue ? value : value.map(function (x) { return x.value; }), reason);
    };
    var tagCloseHandler = function (itemValue, index, event) {
        onRemove && onRemove(itemValue, index, event);
        valueChangeHandler(__spreadArray(__spreadArray([], __read(value.slice(0, index)), false), __read(value.slice(index + 1)), false), 'remove');
    };
    var hotkeyHandler = getHotkeyHandler(new Map([
        [
            Backspace.code,
            function (event) {
                if (!event.target.value && value.length) {
                    for (var index = value.length - 1; index >= 0; index--) {
                        var itemValue = value[index];
                        if (itemValue.closable !== false) {
                            tagCloseHandler(itemValue, index, event);
                            return;
                        }
                    }
                }
            },
        ],
    ]));
    var tryAddInputValueToTag = function () { return __awaiter(_this, void 0, void 0, function () {
        var validateResult, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    if (!(typeof validate === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, validate(inputValue, value)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = true;
                    _b.label = 3;
                case 3:
                    validateResult = _a;
                    if (validateResult) {
                        valueChangeHandler(value.concat({
                            value: validateResult === true ? inputValue : validateResult,
                            label: inputValue,
                        }), 'add');
                        setInputValue('');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var mergedRenderTag = function (item, index, inTooltip) {
        var _a;
        if (inTooltip === void 0) { inTooltip = false; }
        var itemValue = item.value, label = item.label;
        var closable = !readOnly && !disabled && item.closable !== false;
        var onClose = function (event) {
            tagCloseHandler(item, index, event);
        };
        if (renderTag) {
            return renderTag({
                value: itemValue,
                label: label,
                closable: closable,
                onClose: onClose,
            }, index, value);
        }
        var tagProps = {
            closable: closable,
            onClose: onClose,
            visible: true,
            children: fillNBSP(label),
            closeIcon: icon === null || icon === void 0 ? void 0 : icon.removeIcon,
            __closeIconProps: {
                onMouseDown: keepFocus,
            },
            className: cs(prefixCls + "-tag", (_a = {},
                _a[tagClassName] = tagClassName,
                _a)),
            title: typeof label === 'string' ? label : undefined,
        };
        var maxTagCountInNumber = typeof maxTagCount === 'object' ? maxTagCount.count : maxTagCount;
        if (!inTooltip && typeof maxTagCountInNumber === 'number' && index >= maxTagCountInNumber) {
            if (index === value.length - 1) {
                var invisibleTagCount_1 = value.length - maxTagCountInNumber;
                var renderEllipsisLabel = typeof maxTagCount === 'object'
                    ? maxTagCount.render
                    : function () { return React.createElement("span", { className: prefixCls + "-tag-ellipsis" },
                        "+",
                        invisibleTagCount_1); };
                return (React.createElement(Popover, { children: renderEllipsisLabel(invisibleTagCount_1, value), content: React.createElement(React.Fragment, null, value
                        .map(function (v, index) { return ({ tagValue: v, tagIndex: index }); })
                        .slice(-invisibleTagCount_1)
                        .map(function (_a) {
                        var tagValue = _a.tagValue, tagIndex = _a.tagIndex;
                        return mergedRenderTag(tagValue, tagIndex, true);
                    })) }));
            }
            return null;
        }
        return React.createElement(Tag, __assign({}, tagProps));
    };
    var handleTokenSeparators = function (str) { return __awaiter(_this, void 0, void 0, function () {
        var splitTextList, validatedValueList_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // clear the timestamp, and then we can judge whether tokenSeparators has been triggered
                    // according to timestamp value
                    refTSLastSeparateTriggered.current = null;
                    if (!(isArray(tokenSeparators) && tokenSeparators.length)) return [3 /*break*/, 2];
                    splitTextList = str.split(new RegExp("[" + tokenSeparators.join('') + "]"));
                    if (!(splitTextList.length > 1)) return [3 /*break*/, 2];
                    // record the timestamp of tokenSeparators triggered
                    refTSLastSeparateTriggered.current = Date.now();
                    validatedValueList_1 = [];
                    return [4 /*yield*/, Promise.all(splitTextList.map(function (text) { return __awaiter(_this, void 0, void 0, function () {
                            var validateResult, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!text) return [3 /*break*/, 4];
                                        if (!(typeof validate === 'function')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, validate(text, value)];
                                    case 1:
                                        _b = _c.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _b = true;
                                        _c.label = 3;
                                    case 3:
                                        _a = _b;
                                        return [3 /*break*/, 5];
                                    case 4:
                                        _a = false;
                                        _c.label = 5;
                                    case 5:
                                        validateResult = _a;
                                        if (validateResult) {
                                            validatedValueList_1.push({
                                                value: validateResult === true ? text : validateResult,
                                                label: text,
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    if (validatedValueList_1.length) {
                        valueChangeHandler(value.concat(validatedValueList_1), 'add');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var clearIcon = allowClear && !disabled && !readOnly && value.length ? (React.createElement(IconHover, { size: size, key: "clearIcon", className: prefixCls + "-clear-icon", onClick: function (e) {
            var _a;
            e.stopPropagation();
            valueChangeHandler([], 'clear');
            if (!focused) {
                (_a = refInput.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            onClear === null || onClear === void 0 ? void 0 : onClear();
        } }, (icon && icon.clearIcon) || React.createElement(IconClose, null))) : null;
    var disableInputComponent = disabled || disableInput;
    // CSSTransition needs to be a direct child of TransitionGroup, otherwise the animation will NOT work
    // https://github.com/arco-design/arco-design/issues/622
    var childrenWithAnimation = value
        .map(function (x, i) {
        // Check whether two tags have same value. If so, set different key for them to avoid only rendering one tag.
        var isRepeat = value.findIndex(function (item) { return item.value === x.value; }) !== i;
        var eleTag = mergedRenderTag(x, i);
        return React.isValidElement(eleTag) ? (React.createElement(CSSTransition, { key: typeof x.value === 'object' ? i : isRepeat ? x.value + "-" + i : x.value, timeout: CSS_TRANSITION_DURATION, classNames: "zoomIn" }, eleTag)) : (eleTag);
    })
        .concat(React.createElement(CSSTransition, { key: REACT_KEY_FOR_INPUT, timeout: CSS_TRANSITION_DURATION, classNames: "zoomIn" },
        React.createElement(InputComponent, { autoComplete: "off", size: size, disabled: disableInputComponent, readOnly: readOnly, ref: refInput, autoFocus: autoFocus, placeholder: !value.length ? placeholder : '', prefixCls: prefixCls + "-input", autoFitWidth: {
                delay: function () { return refDelay.current; },
                pure: true,
            }, onPressEnter: function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputValue && e.preventDefault();
                            onPressEnter === null || onPressEnter === void 0 ? void 0 : onPressEnter(e);
                            return [4 /*yield*/, tryAddInputValueToTag()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, onFocus: function (e) {
                if (!disableInputComponent && !readOnly) {
                    setFocused(true);
                    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
                }
            }, onBlur: function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setFocused(false);
                            onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                            if (!saveOnBlur) return [3 /*break*/, 2];
                            return [4 /*yield*/, tryAddInputValueToTag()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            setInputValue('');
                            return [2 /*return*/];
                    }
                });
            }); }, value: inputValue, onChange: function (value, event) {
                // Only fire callback on user input to ensure parent component can get real input value on controlled mode.
                onInputChange === null || onInputChange === void 0 ? void 0 : onInputChange(value, event);
                // Pasting in the input box will trigger onPaste first and then onChange, but the value of onChange does not contain a newline character.
                // If word segmentation has just been triggered due to pasting, onChange will no longer attempt word segmentation.
                // Do NOT use await, need to update input value right away.
                event.nativeEvent.inputType !== 'insertFromPaste' && handleTokenSeparators(value);
                if (refTSLastSeparateTriggered.current) {
                    setInputValue('');
                }
                else {
                    setInputValue(value);
                }
            }, onKeyDown: function (event) {
                hotkeyHandler(event);
                onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
            }, onPaste: function (event) {
                onPaste === null || onPaste === void 0 ? void 0 : onPaste(event);
                handleTokenSeparators(event.clipboardData.getData('text'));
            } })));
    var hasPrefix = !isEmptyNode(prefix);
    var hasSuffix = !isEmptyNode(suffix) || !isEmptyNode(clearIcon);
    var needAddBefore = !isEmptyNode(addBefore);
    var needAddAfter = !isEmptyNode(addAfter);
    var needWrapper = needAddBefore || needAddAfter;
    var status = props.status || (error ? 'error' : undefined);
    var innerClassNames = cs(prefixCls, (_a = {},
        _a[prefixCls + "-size-" + size] = size,
        _a[prefixCls + "-disabled"] = disabled,
        _a[prefixCls + "-" + status] = status,
        _a[prefixCls + "-focus"] = focused,
        _a[prefixCls + "-readonly"] = readOnly,
        _a[prefixCls + "-has-suffix"] = hasSuffix,
        _a[prefixCls + "-has-placeholder"] = !value.length,
        _a[prefixCls + "-rtl"] = rtl,
        _a));
    var propsAppliedToRoot = { style: style, className: className };
    var eleInputTagCore = (React.createElement("div", __assign({}, omit(rest, ['status', 'size', 'defaultValue', 'value', 'inputValue']), (needWrapper ? {} : propsAppliedToRoot), { className: needWrapper ? innerClassNames : cs(innerClassNames, propsAppliedToRoot.className), onMouseDown: function (event) {
            focused && keepFocus(event);
        }, onClick: function (e) {
            var _a;
            !focused && ((_a = refInput.current) === null || _a === void 0 ? void 0 : _a.focus());
            if (onClick) {
                onClick(e);
            }
        } }),
        React.createElement("div", { className: prefixCls + "-view" },
            hasPrefix && (React.createElement("div", { className: prefixCls + "-prefix", onMouseDown: keepFocus }, prefix)),
            draggable ? (React.createElement(UsedTransitionGroup, { key: "transitionGroupWithDrag", prefixCls: prefixCls, animation: animation },
                React.createElement(Draggable, { itemWrapperStyle: { display: 'inline-block' }, direction: "horizontal", onIndexChange: function (index, prevIndex) {
                        var moveItem = function (arr, fromIndex, toIndex) {
                            arr = arr.slice();
                            var isMoveLeft = fromIndex > toIndex;
                            var _a = __read(arr.splice(fromIndex, 1), 1), item = _a[0];
                            arr.splice(isMoveLeft ? toIndex : toIndex - 1, 0, item);
                            return arr;
                        };
                        valueChangeHandler(moveItem(value, prevIndex, index), 'sort');
                    } }, childrenWithAnimation))) : (React.createElement(UsedTransitionGroup, { prefixCls: prefixCls, animation: animation }, childrenWithAnimation)),
            hasSuffix && (React.createElement("div", { className: prefixCls + "-suffix", onMouseDown: keepFocus },
                clearIcon,
                suffix)))));
    if (!needWrapper) {
        return eleInputTagCore;
    }
    return (React.createElement("div", __assign({}, propsAppliedToRoot, { className: cs(prefixCls + "-wrapper", (_b = {},
            _b[prefixCls + "-wrapper-rtl"] = rtl,
            _b), propsAppliedToRoot.className) }),
        needAddBefore && React.createElement("div", { className: prefixCls + "-addbefore" }, addBefore),
        eleInputTagCore,
        needAddAfter && React.createElement("div", { className: prefixCls + "-addafter" }, addAfter)));
}
var InputTagRef = React.forwardRef(InputTag);
InputTagRef.displayName = 'InputTag';
export default InputTagRef;
