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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
import React, { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import cs from '../_util/classNames';
import { ArrowUp, ArrowDown, Enter, Esc, Tab } from '../_util/keycode';
import Trigger from '../Trigger';
import OptGroup from './opt-group';
import Option from './option';
import ResizeObserver from '../_util/resizeObserver';
import { isArray, isFunction, isObject } from '../_util/is';
import getHotkeyHandler from '../_util/getHotkeyHandler';
import warning from '../_util/warning';
import SelectView from '../_class/select-view';
import VirtualList from '../_class/VirtualList';
import { preventDefaultEvent, isEmptyValue, getValidValue, isSelectOption, isSelectOptGroup, flatChildren, } from './utils';
import { ConfigContext } from '../ConfigProvider';
import useMergeValue from '../_util/hooks/useMergeValue';
import omit from '../_util/omit';
import useMergeProps from '../_util/hooks/useMergeProps';
import useId from '../_util/hooks/useId';
var defaultProps = {
    trigger: 'click',
    bordered: true,
    filterOption: true,
    unmountOnExit: true,
    defaultActiveFirstOption: true,
};
var triggerPopupAlign = { bottom: 4 };
function Select(baseProps, ref) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, renderEmpty = _a.renderEmpty, componentConfig = _a.componentConfig, rtl = _a.rtl;
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Select);
    var children = props.children, renderFormat = props.renderFormat, defaultActiveFirstOption = props.defaultActiveFirstOption, disabled = props.disabled, unmountOnExit = props.unmountOnExit, notFoundContent = props.notFoundContent, showSearch = props.showSearch, tokenSeparators = props.tokenSeparators, options = props.options, filterOption = props.filterOption, labelInValue = props.labelInValue, getPopupContainer = props.getPopupContainer, trigger = props.trigger, triggerElement = props.triggerElement, triggerProps = props.triggerProps, dropdownRender = props.dropdownRender, dropdownMenuStyle = props.dropdownMenuStyle, dropdownMenuClassName = props.dropdownMenuClassName, virtualListProps = props.virtualListProps, 
    // events
    onChange = props.onChange, onSelect = props.onSelect, onDeselect = props.onDeselect, onClear = props.onClear, onSearch = props.onSearch, onFocus = props.onFocus, onBlur = props.onBlur, onPopupScroll = props.onPopupScroll, onVisibleChange = props.onVisibleChange, onInputValueChange = props.onInputValueChange, onPaste = props.onPaste, onKeyDown = props.onKeyDown;
    // TODO 兼容逻辑，3.0 移除 tags 模式
    var mode = props.mode, allowCreate = props.allowCreate;
    if (mode === 'tags') {
        mode = 'multiple';
        allowCreate = true;
        warning(true, "[Arco Select] The 'tags' mode will be removed in the next major version, please use {mode: \"multiple\", allowCreate: true} instead.");
    }
    var prefixCls = getPrefixCls('select');
    var isMultipleMode = mode === 'multiple';
    // TODO: 统一 useMergeValue 函数的表现
    var _b = __read(useState(getValidValue(props.defaultValue, isMultipleMode, labelInValue)), 2), stateValue = _b[0], setValue = _b[1];
    var value = 'value' in props ? getValidValue(props.value, isMultipleMode, labelInValue) : stateValue;
    var _c = __read(useMergeValue('', {
        value: 'inputValue' in props ? props.inputValue || '' : undefined,
    }), 3), inputValue = _c[0], setInputValue = _c[1], stateInputValue = _c[2];
    var _d = __read(useMergeValue(false, {
        defaultValue: props.defaultPopupVisible,
        value: 'popupVisible' in props
            ? props.popupVisible
            : triggerProps && 'popupVisible' in triggerProps
                ? triggerProps.popupVisible
                : undefined,
    }), 2), popupVisible = _d[0], setPopupVisible = _d[1];
    // allowCreate 时，用户正在创建的选项值
    var _e = __read(useState(null), 2), userCreatingOption = _e[0], setUserCreatingOption = _e[1];
    // allowCreate 时，由用户输入而扩展到选项中的值
    var _f = __read(useState([]), 2), userCreatedOptions = _f[0], setUserCreatedOptions = _f[1];
    // 具有选中态或者 hover 态的 option 的 value
    var _g = __read(useState(isArray(value) ? value[0] : value), 2), valueActive = _g[0], setValueActive = _g[1];
    // 缓存较为耗时的 flatChildren 的结果
    var _h = useMemo(function () {
        return flatChildren({ children: children, options: options, filterOption: filterOption }, {
            prefixCls: prefixCls,
            inputValue: inputValue,
            userCreatedOptions: userCreatedOptions,
            userCreatingOption: userCreatingOption,
        });
    }, [children, options, filterOption, inputValue, userCreatingOption, userCreatedOptions]), childrenList = _h.childrenList, optionInfoMap = _h.optionInfoMap, optionValueList = _h.optionValueList, optionIndexListForArrowKey = _h.optionIndexListForArrowKey, hasOptGroup = _h.hasOptGroup, hasComplexLabelInOptions = _h.hasComplexLabelInOptions;
    // ref
    var refWrapper = useRef(null);
    var refTrigger = useRef(null);
    var refSelectView = useRef(null);
    // 用来保存 value 和选中项的映射
    var refValueMap = useRef([]);
    // 用 none 表示目前处于键盘操作中，忽略鼠标的 onMouseEnter 和 onMouseLeave 事件
    var refKeyboardArrowDirection = useRef(null);
    // 触发 onInputValueChange 回调的值
    var refOnInputChangeCallbackValue = useRef(inputValue);
    // 触发 onInputValueChange 回调的原因
    var refOnInputChangeCallbackReason = useRef(null);
    // 上次成功触发自动分词的时间
    var refTSLastSeparateTriggered = useRef(0);
    // Whether in the hidden animation of drop-down
    var refPopupExiting = useRef(false);
    // Unique ID of this select instance
    var instancePopupID = useId(prefixCls + "-popup-");
    var isNoOptionSelected = isEmptyValue(value, isMultipleMode);
    var valueActiveDefault = useMemo(function () {
        var _a;
        if (defaultActiveFirstOption) {
            var firstValue = isArray(value) ? value[0] : value;
            // only valid option will render in option list
            // if it's not rendered (e.g. filtered by user-search), ignore it
            var isFirstValueOptionSelectable = !isNoOptionSelected && ((_a = optionInfoMap.get(firstValue)) === null || _a === void 0 ? void 0 : _a._valid);
            return isFirstValueOptionSelectable
                ? firstValue
                : optionValueList[optionIndexListForArrowKey[0]];
        }
        return undefined;
    }, [
        value,
        optionInfoMap,
        optionValueList,
        optionIndexListForArrowKey,
        defaultActiveFirstOption,
        isNoOptionSelected,
    ]);
    var scrollIntoView = useCallback(function (optionValue, options) {
        var _a;
        var activeOption = optionInfoMap.get(optionValue);
        if (refWrapper.current && ((_a = activeOption === null || activeOption === void 0 ? void 0 : activeOption.child) === null || _a === void 0 ? void 0 : _a.props)) {
            refWrapper.current.scrollTo({ key: activeOption.child.props._key, options: options });
        }
    }, [optionInfoMap]);
    var userCreatedOptionFormatter = useCallback(function (inputValue, creating) {
        if (creating === void 0) { creating = false; }
        return isObject(allowCreate) && typeof (allowCreate === null || allowCreate === void 0 ? void 0 : allowCreate.formatter) === 'function'
            ? allowCreate.formatter(inputValue, creating)
            : inputValue;
    }, [allowCreate]);
    // Try to update inputValue and trigger onInputValueChange callback
    var tryUpdateInputValue = function (value, reason) {
        if (value !== refOnInputChangeCallbackValue.current ||
            reason !== refOnInputChangeCallbackReason.current) {
            setInputValue(value);
            refOnInputChangeCallbackValue.current = value;
            refOnInputChangeCallbackReason.current = reason;
            onInputValueChange && onInputValueChange(value, reason);
        }
    };
    // 尝试更新 popupVisible，触发 onVisibleChange
    var tryUpdatePopupVisible = function (value) {
        if (popupVisible !== value) {
            setPopupVisible(value);
            onVisibleChange && onVisibleChange(value);
            triggerProps && triggerProps.onVisibleChange && triggerProps.onVisibleChange(value);
        }
    };
    // 处理模式切换时 value 格式的校正
    useEffect(function () {
        if (isMultipleMode) {
            if (!Array.isArray(value)) {
                setValue(value === undefined ? [] : [value]);
            }
        }
        else if (Array.isArray(value)) {
            setValue(value.length === 0 ? undefined : value[0]);
        }
    }, [isMultipleMode, value]);
    // 选项下拉框显示/隐藏时的一些自动行为
    useEffect(function () {
        if (popupVisible) {
            // 重新设置 hover 态的 Option
            setValueActive(valueActiveDefault);
            // 在弹出框动画结束之后再执行scrollIntoView，否则会有不必要的滚动产生
            var firstValue_1 = isArray(value) ? value[0] : value;
            if (!isNoOptionSelected && optionInfoMap.has(firstValue_1)) {
                setTimeout(function () { return scrollIntoView(firstValue_1); });
            }
        }
    }, [popupVisible]);
    // 处理键盘选择Option时的列表滚动
    useEffect(function () {
        if (refKeyboardArrowDirection.current === 'up' ||
            refKeyboardArrowDirection.current === 'down') {
            scrollIntoView(valueActive);
            refKeyboardArrowDirection.current = 'none';
        }
    }, [valueActive]);
    // 选项列表改变后，将 active 选项重置
    useEffect(function () {
        setValueActive(valueActiveDefault);
    }, [JSON.stringify(childrenList.map(function (child) { var _a; return (_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.value; }))]);
    // 更新 refValueMap，避免数组规模无节制扩大
    useEffect(function () {
        refValueMap.current = refValueMap.current.filter(function (x) {
            return isMultipleMode
                ? isArray(value) && value.indexOf(x.value) > -1
                : x.value === value;
        });
    }, [value, isMultipleMode]);
    // allowCreate 时，value 改变时更新下拉框选项
    useEffect(function () {
        if (allowCreate) {
            var nextUserCreatedOptions = void 0;
            if (isEmptyValue(value, isMultipleMode)) {
                nextUserCreatedOptions = [];
            }
            else {
                // 将单选和多选的情况统一处理
                var currentValueList_1 = Array.isArray(value) ? value : [value];
                // 将无对应下拉框选项的 value 当作用户创建的选项
                var newUserCreatedOptions = currentValueList_1
                    .filter(function (v) {
                    var _a;
                    var option = optionInfoMap.get(v) || ((_a = refValueMap.current.find(function (item) { return item.value === v; })) === null || _a === void 0 ? void 0 : _a.option);
                    return !option || option._origin === 'userCreatingOption';
                })
                    .map(function (op) { return userCreatedOptionFormatter(op); });
                // 将 value 中不存在的 Option 移除
                var validUserCreatedOptions = userCreatedOptions.filter(function (op) {
                    var opValue = isObject(op) ? op.value : op;
                    return currentValueList_1.indexOf(opValue) !== -1;
                });
                nextUserCreatedOptions = validUserCreatedOptions.concat(newUserCreatedOptions);
            }
            var getOptionsValueString = function (options) {
                return options.map(function (option) { return (isObject(option) ? option.value : option); }).toString();
            };
            // only update state when user-created options changed
            if (getOptionsValueString(nextUserCreatedOptions) !== getOptionsValueString(userCreatedOptions)) {
                setUserCreatedOptions(nextUserCreatedOptions);
            }
        }
    }, [value, allowCreate, isMultipleMode, userCreatedOptionFormatter]);
    // allowCreate 时，根据输入内容动态修改下拉框选项
    useEffect(function () {
        if (allowCreate) {
            // 避免正在输入的内容覆盖已有的选项
            setUserCreatingOption(inputValue && !optionInfoMap.has(inputValue)
                ? userCreatedOptionFormatter(inputValue, true)
                : null);
        }
    }, [inputValue, userCreatedOptionFormatter]);
    // 在 inputValue 变化时，适时触发 onSearch
    useEffect(function () {
        var reason = refOnInputChangeCallbackReason.current;
        if (stateInputValue === inputValue && (reason === 'manual' || reason === 'optionListHide')) {
            onSearch && onSearch(inputValue, reason);
        }
    }, [inputValue]);
    var getOptionInfoByValue = useCallback(function (value) {
        var option = optionInfoMap.get(value);
        if (option) {
            var index = refValueMap.current.findIndex(function (item) { return item.value === value; });
            if (index > -1) {
                refValueMap.current.splice(index, 1, { value: value, option: option });
            }
            else {
                refValueMap.current.push({ value: value, option: option });
            }
            return option;
        }
        var item = refValueMap.current.find(function (x) { return x.value === value; });
        return item && item.option;
    }, [optionInfoMap]);
    // 使用方向键选择时，获取下一个 active option 的值
    var getValueActive = function (direction) {
        if (!optionIndexListForArrowKey.length) {
            return undefined;
        }
        if (valueActive === undefined || !optionInfoMap.has(valueActive)) {
            return optionValueList[optionIndexListForArrowKey[0]];
        }
        var activeOption = optionInfoMap.get(valueActive);
        var activeIndex = activeOption._index;
        var _index = optionIndexListForArrowKey.indexOf(activeIndex);
        var _length = optionIndexListForArrowKey.length;
        return optionValueList[optionIndexListForArrowKey[((direction === 'up' ? _index - 1 : _index + 1) + _length) % _length]];
    };
    // Object should be returned when labelInValue is true
    var getValueAndOptionForCallback = function (stateValue, isEmpty) {
        if (isEmpty === void 0) { isEmpty = isEmptyValue(stateValue, isMultipleMode); }
        var value = stateValue;
        var option = stateValue === undefined
            ? undefined
            : Array.isArray(stateValue)
                ? stateValue.map(getOptionInfoByValue)
                : getOptionInfoByValue(stateValue);
        if (labelInValue && !isEmpty) {
            var getOptionLabel_1 = function (optionValue, optionInfo) {
                var e_1, _a;
                if (optionInfo) {
                    return optionInfo.children;
                }
                // https://github.com/arco-design/arco-design/issues/442
                // Make sure parameter value has valid label if props.value is already set
                var propValue = 'value' in props ? props.value : 'defaultValue' in props ? props.defaultValue : null;
                // Multiple mode
                if (Array.isArray(propValue)) {
                    try {
                        for (var propValue_1 = __values(propValue), propValue_1_1 = propValue_1.next(); !propValue_1_1.done; propValue_1_1 = propValue_1.next()) {
                            var item = propValue_1_1.value;
                            if (isObject(item) && item.value === optionValue) {
                                return item.label;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (propValue_1_1 && !propValue_1_1.done && (_a = propValue_1.return)) _a.call(propValue_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                // Single mode
                else if (isObject(propValue) && propValue.value === optionValue) {
                    return propValue.label;
                }
            };
            if (Array.isArray(stateValue)) {
                value = stateValue.map(function (optionValue, index) { return ({
                    value: optionValue,
                    label: getOptionLabel_1(optionValue, option[index]),
                }); });
            }
            else {
                value = { value: stateValue, label: getOptionLabel_1(stateValue, option) };
            }
        }
        return { option: option, value: value };
    };
    var tryUpdateSelectValue = function (value) {
        setValue(value);
        if (onChange) {
            var paramsForCallback = getValueAndOptionForCallback(value);
            onChange(paramsForCallback.value, paramsForCallback.option);
        }
    };
    // 多选时，选择/取消选择一个选项
    var checkOption = function (optionValue, operation) {
        // 取消选中时不需要检查option是否存在，因为可能已被外部剔除了此选项
        if (operation === 'remove' || (operation === 'add' && optionInfoMap.get(optionValue))) {
            var newValue = operation === 'add'
                ? value.concat(optionValue)
                : value.filter(function (v) { return v !== optionValue; });
            var callbackToTrigger = operation === 'add' ? onSelect : onDeselect;
            tryUpdateSelectValue(newValue);
            if (typeof callbackToTrigger === 'function') {
                var paramsForCallback = getValueAndOptionForCallback(optionValue, false);
                callbackToTrigger(paramsForCallback.value, paramsForCallback.option);
            }
        }
    };
    var handleOptionClick = function (optionValue, disabled) {
        if (disabled) {
            return;
        }
        if (isMultipleMode) {
            checkOption(optionValue, value.indexOf(optionValue) === -1 ? 'add' : 'remove');
            // 点击一个选项时，清空输入框内容
            if (!isObject(showSearch) || !showSearch.retainInputValueWhileSelect) {
                tryUpdateInputValue('', 'optionChecked');
            }
        }
        else {
            if (optionValue !== value) {
                tryUpdateSelectValue(optionValue);
            }
            setTimeout(function () {
                tryUpdatePopupVisible(false);
            });
        }
    };
    // 注册快捷键
    var hotkeyHandler = getHotkeyHandler(new Map([
        [Esc.code, function () { return tryUpdatePopupVisible(false); }],
        [
            Enter.code,
            function () {
                if (popupVisible) {
                    var option = optionInfoMap.get(valueActive);
                    option && handleOptionClick(valueActive, option.disabled);
                }
                else {
                    tryUpdatePopupVisible(true);
                }
            },
        ],
        [
            Tab.code,
            // 按tab键切换，关闭开启的弹出框
            function () { return tryUpdatePopupVisible(false); },
        ],
        [
            ArrowUp.code,
            function () {
                if (popupVisible) {
                    refKeyboardArrowDirection.current = 'up';
                    setValueActive(getValueActive('up'));
                    return false;
                }
            },
        ],
        [
            ArrowDown.code,
            function () {
                if (popupVisible) {
                    refKeyboardArrowDirection.current = 'down';
                    setValueActive(getValueActive('down'));
                    return false;
                }
            },
        ],
    ]));
    var renderPopup = function () {
        var _a;
        var _b, _c;
        // 没有设置弹出框的 width 时，需要在虚拟列表渲染的瞬间获得子元素的最大宽度
        var needMeasureLongestItem = (triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.autoAlignPopupWidth) === false &&
            (!((_b = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.style) === null || _b === void 0 ? void 0 : _b.width) || ((_c = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.style) === null || _c === void 0 ? void 0 : _c.width) === 'auto');
        // Option 存在复杂子元素时，让获得最长子元素变得困难，此时直接禁用虚拟滚动
        var needForbidVirtual = needMeasureLongestItem && hasComplexLabelInOptions;
        var mergedNotFoundContent = 'notFoundContent' in props ? notFoundContent : renderEmpty('Select');
        // 选项列表元素
        var eleOptionList = childrenList.length ? (React.createElement(VirtualList, __assign({ id: instancePopupID, role: "listbox", style: dropdownMenuStyle, className: cs(prefixCls + "-popup-inner", dropdownMenuClassName), ref: refWrapper, data: childrenList, height: null, isStaticItemHeight: !hasOptGroup, measureLongestItem: needMeasureLongestItem, itemKey: function (child) { return child.props._key; }, onMouseDown: preventDefaultEvent, onMouseMove: function () {
                refKeyboardArrowDirection.current = null;
            }, onScroll: function (e) { return onPopupScroll && onPopupScroll(e.target); } }, virtualListProps, { threshold: needForbidVirtual ? null : virtualListProps === null || virtualListProps === void 0 ? void 0 : virtualListProps.threshold }), function (child) {
            var _a;
            if (isSelectOptGroup(child)) {
                return React.createElement(child.type, __assign({}, child.props, { prefixCls: prefixCls }));
            }
            if (isSelectOption(child)) {
                var optionValue = (_a = child.props) === null || _a === void 0 ? void 0 : _a.value;
                var userCreatingOptionValue = isObject(userCreatingOption)
                    ? userCreatingOption.value
                    : userCreatingOption;
                var userCreatedOptionValues = userCreatedOptions.map(function (op) {
                    return isObject(op) ? op.value : op;
                });
                var optionProps = {
                    prefixCls: prefixCls,
                    rtl: rtl,
                    _valueActive: valueActive,
                    _valueSelect: value,
                    _isMultipleMode: isMultipleMode,
                    _isUserCreatingOption: allowCreate && userCreatingOptionValue === optionValue,
                    _isUserCreatedOption: allowCreate && userCreatedOptionValues.indexOf(optionValue) > -1,
                    _onClick: handleOptionClick,
                    _onMouseEnter: function (value) {
                        refKeyboardArrowDirection.current === null && setValueActive(value);
                    },
                    _onMouseLeave: function () {
                        refKeyboardArrowDirection.current === null && setValueActive(undefined);
                    },
                };
                return child && React.createElement(child.type, __assign({}, child.props, optionProps));
            }
            return child;
        })) : null;
        // Avoid drop-down box jitter when user is creating a selection
        var isUserCreating = allowCreate && inputValue;
        // Dropdown-placeholder when there is no options
        var eleNoOptionPlaceholder = mergedNotFoundContent && !isUserCreating ? (React.createElement("div", { style: dropdownMenuStyle, className: cs(prefixCls + "-popup-inner", dropdownMenuClassName) }, mergedNotFoundContent)) : null;
        return (React.createElement("div", { className: cs(prefixCls + "-popup", (_a = {},
                _a[prefixCls + "-popup-hidden"] = eleOptionList === null && eleNoOptionPlaceholder === null,
                _a[prefixCls + "-popup-multiple"] = isMultipleMode,
                _a)), 
            // Make sure hotkey works when dropdown layer get focused
            tabIndex: -1, onKeyDown: function (e) { return hotkeyHandler(e); } }, typeof dropdownRender === 'function'
            ? dropdownRender(eleOptionList || eleNoOptionPlaceholder)
            : eleOptionList || eleNoOptionPlaceholder));
    };
    var handleTokenSeparators = function (str) {
        // clear the timestamp, and then we can judge whether tokenSeparators has been triggered
        // according to timestamp value
        refTSLastSeparateTriggered.current = null;
        if (isMultipleMode && isArray(tokenSeparators) && tokenSeparators.length) {
            var rawValues_1 = str.split(new RegExp("[" + tokenSeparators.join('') + "]"));
            // 输入了分隔符的情况
            if (rawValues_1.length > 1) {
                // record the timestamp of tokenSeparators triggered
                refTSLastSeparateTriggered.current = Date.now();
                var splitValues = rawValues_1.filter(function (v, index) { return v && rawValues_1.indexOf(v) === index; });
                var newValue_1 = value.slice(0);
                var needUpdate_1 = false;
                splitValues.forEach(function (v) {
                    if (newValue_1.indexOf(v) === -1 && (allowCreate || optionInfoMap.get(v))) {
                        newValue_1.push(v);
                        needUpdate_1 = true;
                    }
                });
                if (needUpdate_1) {
                    tryUpdateSelectValue(newValue_1);
                }
            }
        }
        return !!refTSLastSeparateTriggered.current;
    };
    // SelectView组件事件处理
    var selectViewEventHandlers = {
        onFocus: onFocus,
        onBlur: function (event) {
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(event);
            // when drop-down is always hidden, input-text needs to be cleared after blur
            !popupVisible && !refPopupExiting.current && tryUpdateInputValue('', 'optionListHide');
        },
        onKeyDown: function (event) {
            // 处理特殊功能键的自动分词
            if (event.target.tagName === 'INPUT' && event.target.value) {
                var isTab = event.key === Tab.key;
                var isEnter = event.key === Enter.key;
                if (isEnter || isTab) {
                    var suffix = isEnter ? '\n' : isTab ? '\t' : '';
                    if (handleTokenSeparators(event.target.value + suffix)) {
                        // 回车后不会触发 onChangeInputValue 回调，所以在这里直接清空输入框
                        tryUpdateInputValue('', 'tokenSeparator');
                    }
                }
            }
            // 处理快捷键
            hotkeyHandler(event);
            onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        },
        onChangeInputValue: function (value, _a) {
            var inputType = _a.nativeEvent.inputType;
            // Pasting in the input box will trigger onPaste first and then onChange, but the value of onChange does not contain a newline character.
            // If word segmentation has just been triggered due to pasting, onChange will no longer attempt word segmentation.
            // Do NOT use await, need to update input value right away
            inputType !== 'insertFromPaste' && handleTokenSeparators(value);
            if (refTSLastSeparateTriggered.current) {
                tryUpdateInputValue('', 'tokenSeparator');
            }
            else {
                tryUpdateInputValue(value, 'manual');
            }
            if (!popupVisible && value) {
                tryUpdatePopupVisible(true);
            }
        },
        onPaste: function (e) {
            handleTokenSeparators(e.clipboardData.getData('text'));
            onPaste === null || onPaste === void 0 ? void 0 : onPaste(e);
        },
        // Option Items
        onRemoveCheckedItem: function (_, index, event) {
            event.stopPropagation();
            checkOption(value[index], 'remove');
        },
        onClear: function (event) {
            event.stopPropagation();
            if (isMultipleMode) {
                // 保留已经被选中但被disabled的选项值
                var newValue = value.filter(function (v) {
                    var item = optionInfoMap.get(v);
                    return item && item.disabled;
                });
                tryUpdateSelectValue(newValue);
            }
            else {
                tryUpdateSelectValue(undefined);
            }
            tryUpdateInputValue('', 'manual');
            onClear === null || onClear === void 0 ? void 0 : onClear(popupVisible);
        },
    };
    useImperativeHandle(ref, function () {
        var _a;
        return ({
            dom: (_a = refSelectView.current) === null || _a === void 0 ? void 0 : _a.dom,
            focus: function () {
                refSelectView.current && refSelectView.current.focus();
            },
            blur: function () {
                refSelectView.current && refSelectView.current.blur();
            },
            hotkeyHandler: hotkeyHandler,
            activeOptionValue: valueActive,
            getOptionInfoByValue: getOptionInfoByValue,
            getOptionInfoList: function () { return __spreadArray([], __read(optionInfoMap.values()), false).filter(function (info) { return info._valid; }); },
            scrollIntoView: scrollIntoView,
        });
    }, [hotkeyHandler, optionInfoMap, valueActive, getOptionInfoByValue, scrollIntoView]);
    var renderView = function (eleView) {
        return (React.createElement(Trigger, __assign({ ref: function (ref) { return (refTrigger.current = ref); }, popup: renderPopup, trigger: trigger, disabled: disabled, getPopupContainer: getPopupContainer, classNames: "slideDynamicOrigin", autoAlignPopupWidth: true, popupAlign: triggerPopupAlign, popupVisible: popupVisible, unmountOnExit: unmountOnExit, onVisibleChange: tryUpdatePopupVisible, __onExit: function () {
                refPopupExiting.current = true;
            }, __onExited: function () {
                refPopupExiting.current = false;
                tryUpdateInputValue('', 'optionListHide');
            } }, omit(triggerProps, ['popupVisible', 'onVisibleChange'])), eleView));
    };
    var usedTriggerElement = typeof triggerElement === 'function'
        ? triggerElement(getValueAndOptionForCallback(value))
        : triggerElement;
    return (React.createElement(ResizeObserver, { onResize: function () { return refTrigger.current.updatePopupPosition(); } }, usedTriggerElement !== undefined && usedTriggerElement !== null ? (renderView(usedTriggerElement)) : (React.createElement(SelectView, __assign({}, props, selectViewEventHandlers, { ref: refSelectView, 
        // state
        value: value, inputValue: inputValue, popupVisible: popupVisible, 
        // other
        rtl: rtl, prefixCls: prefixCls, allowCreate: !!allowCreate, ariaControls: instancePopupID, isEmptyValue: isNoOptionSelected, isMultiple: isMultipleMode, onSort: tryUpdateSelectValue, renderText: function (value) {
            var option = getOptionInfoByValue(value);
            var text = value;
            if (isFunction(renderFormat)) {
                var paramsForCallback = getValueAndOptionForCallback(value, false);
                text = renderFormat(paramsForCallback.option || null, paramsForCallback.value);
            }
            else {
                var foundLabelFromProps = false;
                if (labelInValue) {
                    var propValue = props.value || props.defaultValue;
                    if (Array.isArray(propValue)) {
                        var targetLabeledValue = propValue.find(function (item) { return isObject(item) && item.value === value; });
                        if (targetLabeledValue) {
                            text = targetLabeledValue.label;
                            foundLabelFromProps = true;
                        }
                    }
                    else if (isObject(propValue)) {
                        text = propValue.label;
                        foundLabelFromProps = true;
                    }
                }
                if (!foundLabelFromProps && option && 'children' in option) {
                    text = option.children;
                }
            }
            return {
                text: text,
                disabled: option && option.disabled,
            };
        }, renderView: renderView })))));
}
var ForwardRefSelect = React.forwardRef(Select);
var SelectComponent = ForwardRefSelect;
SelectComponent.displayName = 'Select';
SelectComponent.Option = Option;
SelectComponent.OptGroup = OptGroup;
export default SelectComponent;
