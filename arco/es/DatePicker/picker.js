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
import React, { useState, useRef, useEffect, useContext } from 'react';
import Trigger from '../Trigger';
import DateInput from '../_class/picker/input';
import { isArray, isDayjs, isObject, isUndefined } from '../_util/is';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import omit from '../_util/omit';
import { getDayjsValue, dayjs, getNow, getValueWithTime, methods, isDayjsChange, toLocal, toTimezone, } from '../_util/dayjs';
import IconCalendar from '../../icon/react-icon/IconCalendar';
import IconCalendarClock from '../../icon/react-icon/IconCalendarClock';
import Footer from './panels/footer';
import Shortcuts from './panels/shortcuts';
import useMergeProps from '../_util/hooks/useMergeProps';
import PickerContext from './context';
import usePrevious from '../_util/hooks/usePrevious';
import useUpdate from '../_util/hooks/useUpdate';
import { getDefaultWeekStart, getLocaleDayjsValue } from './util';
import { pickDataAttributes } from '../_util/pick';
function getFormat(props) {
    var format = props.format, picker = props.picker, showTime = props.showTime;
    var valueFormat;
    var mode = props.mode || picker.props.pickerType;
    switch (mode) {
        case 'date':
            valueFormat = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
            break;
        case 'month':
            valueFormat = 'YYYY-MM';
            break;
        case 'year':
            valueFormat = 'YYYY';
            break;
        case 'week':
            valueFormat = 'gggg-wo';
            break;
        case 'quarter':
            valueFormat = 'YYYY-[Q]Q';
            break;
        default:
            valueFormat = 'YYYY-MM-DD';
    }
    if (format) {
        valueFormat = format;
    }
    return valueFormat;
}
var defaultProps = {
    allowClear: true,
    unmountOnExit: true,
    position: 'bl',
    editable: true,
    showNowBtn: true,
};
var triggerPopupAlign = { bottom: 4 };
var Picker = function (baseProps) {
    var _a = useContext(ConfigContext), getPrefixCls = _a.getPrefixCls, locale = _a.locale, ctxSize = _a.size, componentConfig = _a.componentConfig, rtl = _a.rtl;
    if (rtl) {
        defaultProps.position = 'br';
    }
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.DatePicker);
    var allowClear = props.allowClear, className = props.className, style = props.style, placeholder = props.placeholder, getPopupContainer = props.getPopupContainer, disabled = props.disabled, position = props.position, error = props.error, status = props.status, unmountOnExit = props.unmountOnExit, editable = props.editable, triggerProps = props.triggerProps, picker = props.picker, shortcuts = props.shortcuts, onSelect = props.onSelect, onVisibleChange = props.onVisibleChange, propsValue = props.value, onChange = props.onChange, icons = props.icons, disabledDate = props.disabledDate, showTime = props.showTime, showNowBtn = props.showNowBtn, onSelectShortcut = props.onSelectShortcut, extra = props.extra, shortcutsPlacementLeft = props.shortcutsPlacementLeft, onOk = props.onOk, defaultPickerValue = props.defaultPickerValue, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, triggerElement = props.triggerElement, utcOffset = props.utcOffset, timezone = props.timezone, panelRender = props.panelRender, inputProps = props.inputProps;
    var prefixCls = getPrefixCls('picker');
    var DATEPICKER_LOCALE = locale.DatePicker;
    var weekStart = isUndefined(props.dayStartOfWeek)
        ? getDefaultWeekStart(locale.dayjsLocale)
        : props.dayStartOfWeek;
    // picker.props.pickerType: Compatible with defaultProps
    var mode = props.mode || picker.props.pickerType;
    var refInput = useRef(null);
    var refPanel = useRef(null);
    var refShortcuts = useRef(null);
    var realFormat = getFormat(props);
    var format = realFormat;
    if (typeof format === 'function') {
        format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    }
    function getDefaultValue() {
        var value;
        if (props.value) {
            value = getDayjsValue(props.value, format, utcOffset, timezone);
        }
        else {
            value = getDayjsValue(props.defaultValue, format, utcOffset, timezone);
        }
        return value;
    }
    var _b = __read(useState(getDefaultValue()), 2), value = _b[0], setValue = _b[1];
    var _c = __read(useState(props.popupVisible), 2), popupVisible = _c[0], setPopupVisible = _c[1];
    var _d = __read(useState(false), 2), isTimePanel = _d[0], setIsTimePanel = _d[1];
    var _e = __read(useState(), 2), hoverPlaceholderValue = _e[0], setHoverPlaceholderValue = _e[1];
    var mergedPopupVisible = 'popupVisible' in props ? props.popupVisible : popupVisible;
    var mergedValue = 'value' in props ? getDayjsValue(propsValue, format, utcOffset, timezone) : value;
    var defaultPageShowDate = mergedValue || getDayjsValue(defaultPickerValue, format) || getNow();
    var _f = __read(useState(), 2), inputValue = _f[0], setInputValue = _f[1];
    var _g = __read(useState(), 2), valueShow = _g[0], setValueShow = _g[1];
    var _h = __read(useState(), 2), shortcutValue = _h[0], setShortcutValue = _h[1];
    var _j = __read(useState(defaultPageShowDate), 2), pageShowDate = _j[0], setPageShowDate = _j[1];
    var mergedPageShowDate = getDayjsValue(pickerValue, format) || pageShowDate;
    var panelValue = shortcutValue || valueShow || mergedValue;
    var _k = __read(useState(mode), 2), panelMode = _k[0], setPanelMode = _k[1];
    var defaultTimeValue = (isObject(showTime) &&
        getDayjsValue(showTime.defaultValue, showTime.format || 'HH:mm:ss')) ||
        getNow(utcOffset, timezone);
    var timeValue = panelValue || defaultTimeValue;
    function focusInput() {
        refInput.current && refInput.current.blur && refInput.current.focus();
    }
    function blurInput() {
        refInput.current && refInput.current.blur && refInput.current.blur();
    }
    var previousUtcOffset = usePrevious(utcOffset);
    var previousTimezone = usePrevious(timezone);
    // when timezone or utcOffset change changed
    useUpdate(function () {
        if (value && (previousUtcOffset !== utcOffset || timezone !== previousTimezone)) {
            var localValue = toLocal(value, previousUtcOffset, previousTimezone);
            setValue(toTimezone(localValue, utcOffset, timezone));
        }
    }, [utcOffset, previousUtcOffset, timezone, previousTimezone]);
    useEffect(function () {
        setInputValue(undefined);
        setHoverPlaceholderValue(undefined);
        if (mergedPopupVisible) {
            setPageShowDate(defaultPageShowDate);
            if (shortcutsPlacementLeft) {
                refShortcuts.current.style.maxHeight = refPanel.current.clientHeight + "px";
            }
        }
        else {
            setValueShow(undefined);
            setShortcutValue(undefined);
            setTimeout(function () {
                setIsTimePanel(false);
                setPanelMode(mode);
                blurInput();
            }, 100);
        }
    }, [mergedPopupVisible]);
    function visibleChange(visible) {
        if (visible) {
            setOpen(visible, function () {
                focusInput();
            });
        }
        else {
            setOpen(false);
        }
    }
    function handlePickerValueChange(v) {
        onPickerValueChange && onPickerValueChange(v.format(format), v);
    }
    function setOpen(visible, callback) {
        setPopupVisible(visible);
        onVisibleChange && onVisibleChange(visible);
        callback === null || callback === void 0 ? void 0 : callback();
    }
    function onClear(e) {
        e.stopPropagation();
        setValue(undefined);
        setValueShow(undefined);
        onHandleChange(undefined);
        props.onClear && props.onClear();
    }
    function onClickConfirmBtn() {
        var pv = getLocaleDayjsValue(panelValue, locale.dayjsLocale);
        onConfirmValue();
        onOk && onOk(pv && pv.format(format), pv);
    }
    function onConfirmValue() {
        setValue(panelValue);
        onHandleChange(panelValue);
        setOpen(false);
    }
    function onHandleSelect(_, date, now) {
        setInputValue(undefined);
        setHoverPlaceholderValue(undefined);
        if (showTime) {
            var newTime = now ? date : getValueWithTime(date, timeValue);
            setValueShow(newTime);
            setPageShowDate(newTime);
            var localTime = getLocaleDayjsValue(toLocal(newTime, utcOffset, timezone), locale.dayjsLocale);
            onSelect && onSelect(localTime.format(format), localTime);
        }
        else {
            var localTime = getLocaleDayjsValue(toLocal(date, utcOffset, timezone).locale(locale.dayjsLocale), locale.dayjsLocale);
            onSelect && onSelect(localTime ? localTime.format(format) : undefined, localTime);
            setValue(date);
            onHandleChange(date);
            setOpen(false);
        }
    }
    function onHandleChange(newValue) {
        if (isDayjsChange(newValue, mergedValue)) {
            var localValue = getLocaleDayjsValue(toLocal(newValue, utcOffset, timezone), locale.dayjsLocale);
            onChange && onChange(localValue ? localValue.format(format) : undefined, localValue);
        }
    }
    function onTimePickerSelect(_, time) {
        var _valueShow = panelValue || getNow(utcOffset, timezone);
        var newValueShow = getValueWithTime(_valueShow, time);
        setValueShow(newValueShow);
        var localNewValueShow = getLocaleDayjsValue(toLocal(newValueShow, utcOffset, timezone), locale.dayjsLocale);
        onSelect && onSelect(localNewValueShow.format(format), localNewValueShow);
    }
    function isValid(time) {
        return (typeof time === 'string' &&
            dayjs(time, format).format(format) === time &&
            (typeof disabledDate === 'function' ? !disabledDate(dayjs(time, format)) : true));
    }
    function onChangeInput(e) {
        var niv = e.target.value;
        setInputValue(niv);
        if (!mergedPopupVisible) {
            setOpen(true);
        }
        if (isValid(niv)) {
            // https://github.com/arco-design/arco-design/issues/1986
            var newValue = getDayjsValue(niv, format);
            setValueShow(newValue);
            setPageShowDate(newValue);
            setInputValue(undefined);
        }
    }
    function onPressEnter() {
        if (panelValue) {
            onConfirmValue();
            blurInput();
        }
        else if (mergedPopupVisible) {
            setOpen(false);
        }
    }
    function changePageShowDate(type, unit, num) {
        if (num === void 0) { num = 1; }
        var newPageShowDate;
        if (type === 'prev') {
            newPageShowDate = methods.subtract(mergedPageShowDate, num, unit);
        }
        if (type === 'next') {
            newPageShowDate = methods.add(mergedPageShowDate, num, unit);
        }
        handlePickerValueChange(newPageShowDate);
        setPageShowDate(newPageShowDate);
    }
    function getHeaderOperations(pickMode) {
        if (pickMode === void 0) { pickMode = mode; }
        if (pickMode === 'date' || pickMode === 'week') {
            return {
                onPrev: function () { return changePageShowDate('prev', 'month'); },
                onNext: function () { return changePageShowDate('next', 'month'); },
                onSuperPrev: function () { return changePageShowDate('prev', 'year'); },
                onSuperNext: function () { return changePageShowDate('next', 'year'); },
            };
        }
        if (pickMode === 'month' || pickMode === 'quarter') {
            return {
                onSuperPrev: function () { return changePageShowDate('prev', 'year'); },
                onSuperNext: function () { return changePageShowDate('next', 'year'); },
            };
        }
        if (pickMode === 'year') {
            return {
                onSuperPrev: function () { return changePageShowDate('prev', 'year', 10); },
                onSuperNext: function () { return changePageShowDate('next', 'year', 10); },
            };
        }
    }
    function onSelectNow() {
        var now = getLocaleDayjsValue(getNow(utcOffset, timezone), locale.dayjsLocale);
        handlePickerValueChange(now);
        onHandleSelect(now.format(format), now, true);
    }
    function onMouseEnterCell(value, disabled) {
        if (!disabled) {
            var placeHolderValue = showTime ? getValueWithTime(value, timeValue) : value;
            setHoverPlaceholderValue(typeof realFormat === 'function'
                ? realFormat(value)
                : placeHolderValue.locale(locale.dayjsLocale).format(format));
        }
    }
    function onMouseLeaveCell() {
        setHoverPlaceholderValue(undefined);
    }
    function onMouseEnterShortcut(shortcut) {
        if (typeof shortcut.value === 'function' && isDayjs(shortcut.value())) {
            var sv = getDayjsValue(shortcut.value(), format, utcOffset, timezone);
            setPageShowDate(sv);
            handlePickerValueChange(sv);
            setShortcutValue(sv);
        }
    }
    function onMouseLeaveShortcut() {
        var newValue = valueShow || mergedValue || getNow(utcOffset, timezone);
        setShortcutValue(undefined);
        setPageShowDate(newValue);
        handlePickerValueChange(newValue);
    }
    function onHandleSelectShortcut(shortcut) {
        onSelectShortcut && onSelectShortcut(shortcut);
        if (typeof shortcut.value === 'function' && isDayjs(shortcut.value())) {
            var time = getDayjsValue(shortcut.value(), format, utcOffset, timezone);
            setValue(time);
            onHandleChange(time);
            setOpen(false);
        }
    }
    function onClickSelectTimeBtn() {
        setIsTimePanel(!isTimePanel);
    }
    function renderPopup(panelOnly) {
        var _a;
        var classNames = cs(prefixCls + "-container", (_a = {},
            _a[prefixCls + "-panel-only"] = panelOnly,
            _a[prefixCls + "-container-shortcuts-placement-left"] = isArray(shortcuts) && shortcutsPlacementLeft,
            _a[prefixCls + "-container-rtl"] = rtl,
            _a), panelOnly ? className : '');
        var shortcutsProps = {
            prefixCls: prefixCls,
            showTime: showTime,
            shortcuts: shortcuts,
            onSelectNow: onSelectNow,
            showNowBtn: showNowBtn,
            onMouseEnterShortcut: onMouseEnterShortcut,
            onMouseLeaveShortcut: onMouseLeaveShortcut,
            onSelectShortcut: onHandleSelectShortcut,
        };
        var shouldShowFooter = (showTime && panelMode === 'date') ||
            extra ||
            (isArray(shortcuts) && shortcuts.length && !shortcutsPlacementLeft) ||
            (!showTime && panelMode === 'date' && showNowBtn);
        var content = (React.createElement(React.Fragment, null,
            React.cloneElement(picker, __assign(__assign(__assign({}, omit(props, ['style'])), getHeaderOperations()), { getHeaderOperations: getHeaderOperations, onSelect: onHandleSelect, onTimePickerSelect: onTimePickerSelect, onSelectNow: onSelectNow, popupVisible: mergedPopupVisible, format: format, value: panelValue, pageShowDate: mergedPageShowDate, localeName: locale.dayjsLocale, setPageShowDate: function (v) {
                    setPageShowDate(v);
                    handlePickerValueChange(v);
                }, timeValue: timeValue, isTimePanel: isTimePanel, panelMode: panelMode, setPanelMode: setPanelMode, onMouseEnterCell: onMouseEnterCell, onMouseLeaveCell: onMouseLeaveCell })),
            !!shouldShowFooter && (React.createElement(Footer, __assign({}, shortcutsProps, { DATEPICKER_LOCALE: DATEPICKER_LOCALE, disabled: !panelValue, onClickConfirmBtn: onClickConfirmBtn, extra: extra, mode: panelMode, shortcutsPlacementLeft: shortcutsPlacementLeft, onClickSelectTimeBtn: onClickSelectTimeBtn, isTimePanel: isTimePanel })))));
        var contentWithShortcuts = shortcutsPlacementLeft ? (React.createElement(React.Fragment, null,
            React.createElement(Shortcuts, __assign({ ref: refShortcuts }, shortcutsProps)),
            React.createElement("div", { ref: refPanel, className: prefixCls + "-panel-wrapper" }, content))) : (content);
        var panelNode = typeof panelRender === 'function' ? panelRender(contentWithShortcuts) : contentWithShortcuts;
        return (React.createElement("div", { className: classNames, onClick: function () {
                refInput.current && refInput.current.focus && refInput.current.focus();
            }, style: panelOnly ? style : {} }, panelNode));
    }
    var size = props.size || ctxSize;
    var suffixIcon = icons && icons.inputSuffix === null
        ? null
        : (icons && icons.inputSuffix) || (showTime ? React.createElement(IconCalendarClock, null) : React.createElement(IconCalendar, null));
    var baseInputProps = {
        style: style,
        className: className,
        popupVisible: mergedPopupVisible,
        format: realFormat,
        disabled: disabled,
        error: error,
        status: status,
        size: size,
        onPressEnter: onPressEnter,
        onClear: onClear,
        prefix: props.prefix,
        suffixIcon: suffixIcon,
        editable: editable && typeof realFormat !== 'function',
        allowClear: allowClear,
    };
    return (React.createElement(PickerContext.Provider, { value: { utcOffset: utcOffset, timezone: timezone, weekStart: weekStart } }, triggerElement === null ? (renderPopup(true)) : (React.createElement(Trigger, __assign({ popup: renderPopup, trigger: "click", clickToClose: false, position: position, disabled: disabled, popupAlign: triggerPopupAlign, getPopupContainer: getPopupContainer, onVisibleChange: visibleChange, popupVisible: mergedPopupVisible, classNames: "slideDynamicOrigin", unmountOnExit: unmountOnExit }, triggerProps), triggerElement || (React.createElement(DateInput, __assign({}, pickDataAttributes(props), baseInputProps, { ref: refInput, placeholder: placeholder || DATEPICKER_LOCALE.placeholder[mode], popupVisible: mergedPopupVisible, value: valueShow || mergedValue, inputValue: hoverPlaceholderValue || inputValue, prefixCls: prefixCls, onChange: onChangeInput, isPlaceholder: !!hoverPlaceholderValue, inputProps: inputProps })))))));
};
export default Picker;
