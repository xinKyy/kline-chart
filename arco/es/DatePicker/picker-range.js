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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useRef, useEffect, useContext } from 'react';
import Trigger from '../Trigger';
import DateInputRange from '../_class/picker/input-range';
import { isArray, isDayjs, isObject, isUndefined } from '../_util/is';
import cs from '../_util/classNames';
import { pickDataAttributes } from '../_util/pick';
import { ConfigContext } from '../ConfigProvider';
import { getDayjsValue, getValueWithTime, getNow, methods, getSortedDayjsArray, isDayjsArrayChange, toTimezone, toLocal, isValidTimeString, } from '../_util/dayjs';
import IconCalendar from '../../icon/react-icon/IconCalendar';
import IconCalendarClock from '../../icon/react-icon/IconCalendarClock';
import RangePickerPanel from './panels/range';
import Footer from './panels/footer';
import Shortcuts from './panels/shortcuts';
import { getAvailableDayjsLength, getDefaultWeekStart, getLocaleDayjsValue, getFormatByIndex, } from './util';
import useMergeProps from '../_util/hooks/useMergeProps';
import usePrevious from '../_util/hooks/usePrevious';
import useUpdate from '../_util/hooks/useUpdate';
import PickerContext from './context';
// get default format by mode
function getFormat(props) {
    var format = props.format, showTime = props.showTime, mode = props.mode;
    var valueFormat;
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
            valueFormat = 'YYYY-wo';
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
    mode: 'date',
};
var triggerPopupAlign = { bottom: 4 };
var Picker = function (baseProps) {
    var _a, _b;
    var _c = useContext(ConfigContext), getPrefixCls = _c.getPrefixCls, locale = _c.locale, ctxSize = _c.size, componentConfig = _c.componentConfig, rtl = _c.rtl;
    if (rtl) {
        defaultProps.position = 'br';
    }
    var props = useMergeProps(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.DatePicker);
    var allowClear = props.allowClear, className = props.className, style = props.style, placeholder = props.placeholder, getPopupContainer = props.getPopupContainer, disabled = props.disabled, position = props.position, error = props.error, status = props.status, unmountOnExit = props.unmountOnExit, editable = props.editable, triggerProps = props.triggerProps, shortcuts = props.shortcuts, onSelect = props.onSelect, onVisibleChange = props.onVisibleChange, propsValue = props.value, onChange = props.onChange, icons = props.icons, disabledDate = props.disabledDate, disabledTime = props.disabledTime, mode = props.mode, showTime = props.showTime, onSelectShortcut = props.onSelectShortcut, extra = props.extra, shortcutsPlacementLeft = props.shortcutsPlacementLeft, onOk = props.onOk, defaultPickerValue = props.defaultPickerValue, pickerValue = props.pickerValue, panelRender = props.panelRender, onPickerValueChange = props.onPickerValueChange, triggerElement = props.triggerElement, clearRangeOnReselect = props.clearRangeOnReselect, separator = props.separator, utcOffset = props.utcOffset, timezone = props.timezone, inputProps = props.inputProps;
    var prefixCls = getPrefixCls('picker-range');
    var weekStart = isUndefined(props.dayStartOfWeek)
        ? getDefaultWeekStart(locale.dayjsLocale)
        : props.dayStartOfWeek;
    var refInput = useRef(null);
    var refPanel = useRef(null);
    var refShortcuts = useRef(null);
    var shortcutEnterTimer = useRef(null);
    var shortcutLeaveTimer = useRef(null);
    var format = getFormat(props);
    // get input index when half disabled
    function getAvailableInputIndex() {
        if (isArray(disabled)) {
            if (disabled[0] && !disabled[1]) {
                return 1;
            }
            if (disabled[1] && !disabled[0]) {
                return 0;
            }
        }
    }
    var availableInputIndex = getAvailableInputIndex();
    var isHalfAvailable = typeof availableInputIndex === 'number';
    var disabledTimePickerIndex = isHalfAvailable ? 1 ^ availableInputIndex : undefined;
    // current focus index
    var _d = __read(useState(isHalfAvailable ? availableInputIndex : 0), 2), focusedInputIndex = _d[0], setFocusedInputIndex = _d[1];
    useEffect(function () {
        if (isHalfAvailable) {
            setFocusedInputIndex(availableInputIndex);
        }
    }, [disabled]);
    var nextFocusedInputIndex = 1 ^ focusedInputIndex;
    var _e = __read(useState(), 2), inputValue = _e[0], setInputValue = _e[1];
    var _f = __read(useState(), 2), hoverPlaceholderValue = _f[0], setHoverPlaceholderValue = _f[1];
    var _g = __read(useState(getDefaultValue()), 2), value = _g[0], setValue = _g[1];
    var _h = __read(useState(), 2), valueShow = _h[0], setValueShow = _h[1];
    var _j = __read(useState(), 2), valueShowHover = _j[0], setValueShowHover = _j[1];
    var _k = __read(useState(), 2), shortcutsValue = _k[0], setShortcutsValue = _k[1];
    var _l = __read(useState(props.popupVisible), 2), popupVisible = _l[0], setPopupVisible = _l[1];
    var _m = __read(useState([mode, mode]), 2), panelModes = _m[0], setPanelModes = _m[1];
    var _o = __read(useState(false), 2), isTimePanel = _o[0], setIsTimePanel = _o[1];
    var mergedPopupVisible = 'popupVisible' in props ? props.popupVisible : popupVisible;
    var propsValueDayjs = getDayjsValue(propsValue, format, utcOffset, timezone);
    var mergedValue = 'value' in props ? propsValueDayjs : value;
    var panelValue = shortcutsValue || valueShow || mergedValue || [];
    var selectedLength = getAvailableDayjsLength(valueShow || mergedValue);
    // the first time we select a range after open
    var firstRange = useRef(true);
    var now = getNow();
    var zoneNow = toTimezone(now, utcOffset, timezone);
    function getTimeValues() {
        var timeValues = [];
        var defaultTimeValue = isObject(showTime) && showTime.defaultValue
            ? getDayjsValue(showTime.defaultValue, showTime.format || 'HH:mm:ss')
            : [];
        timeValues[0] = panelValue[0] || defaultTimeValue[0] || zoneNow;
        timeValues[1] = panelValue[1] || defaultTimeValue[1] || zoneNow;
        return timeValues;
    }
    var timeValues = getTimeValues();
    var selectedDisabledDate = isHalfAvailable
        ? function (current) {
            return availableInputIndex === 0
                ? current.isAfter(panelValue[1], mode)
                : current.isBefore(panelValue[0], mode);
        }
        : undefined;
    // if triggerElement !== undefined, we should activate clearRangeOnReselect by default
    var customTriggerElement = triggerElement !== undefined;
    var resetRange = customTriggerElement || clearRangeOnReselect;
    function getDefaultValue() {
        var value;
        if (props.value) {
            value = getDayjsValue(props.value, format, utcOffset, timezone);
        }
        else {
            value = getDayjsValue(props.defaultValue, format, utcOffset, timezone);
        }
        if (isHalfAvailable && (!value || (value && !value[nextFocusedInputIndex]))) {
            var nv = [];
            nv[nextFocusedInputIndex] = getNow(utcOffset, timezone);
            return nv;
        }
        return value;
    }
    var defaultPageShowDates = mergedValue ||
        getDayjsValue(defaultPickerValue, format) || [now, now];
    // show date at two panels
    var _p = __read(useState(getShowDatesFromFocused(defaultPageShowDates)), 2), pageShowDates = _p[0], setPageShowDates = _p[1];
    var mergedPageShowDate = getShowDatesFromFocused(getDayjsValue(pickerValue, format, utcOffset, timezone)) ||
        pageShowDates;
    var previousUtcOffset = usePrevious(utcOffset);
    var previousTimezone = usePrevious(timezone);
    // when timezone or utcOffset change changed
    useUpdate(function () {
        if (isArray(value) && (previousUtcOffset !== utcOffset || timezone !== previousTimezone)) {
            var localValue = value.map(function (v) { return toLocal(v, previousUtcOffset, previousTimezone); });
            var zoneValue = localValue.map(function (v) { return toTimezone(v, utcOffset, timezone); });
            setValue(zoneValue);
        }
    }, [utcOffset, previousUtcOffset, timezone, previousTimezone]);
    // panel open and change mode
    useUpdate(function () {
        setPageShowDates(getShowDatesFromFocused(defaultPageShowDates));
    }, [mode]);
    useEffect(function () {
        setPanelModes([mode, mode]);
    }, [mode]);
    useEffect(function () {
        setHoverPlaceholderValue(undefined);
        setInputValue(undefined);
        if (mergedPopupVisible) {
            var resetPageShowDates = getShowDatesFromFocused(defaultPageShowDates);
            setIsTimePanel(false);
            setPanelModes([mode, mode]);
            setPageShowDates(resetPageShowDates);
            handlePickerValueChange(resetPageShowDates);
            setValueShow(mergedValue);
            if (shortcutsPlacementLeft) {
                refShortcuts.current.style.maxHeight = refPanel.current.clientHeight + "px";
            }
        }
        else {
            setValueShow(undefined);
            setValueShowHover(undefined);
            setShortcutsValue(undefined);
            blurInput();
        }
        firstRange.current = mergedPopupVisible;
    }, [mergedPopupVisible]);
    var startStr = (_a = propsValueDayjs === null || propsValueDayjs === void 0 ? void 0 : propsValueDayjs[0]) === null || _a === void 0 ? void 0 : _a.format(getFormatByIndex(format, 0));
    var endStr = (_b = propsValueDayjs === null || propsValueDayjs === void 0 ? void 0 : propsValueDayjs[1]) === null || _b === void 0 ? void 0 : _b.format(getFormatByIndex(format, 1));
    useEffect(function () {
        setValueShow(undefined);
        setValueShowHover(undefined);
    }, [startStr, endStr]);
    function setFixedPageShowDates(innerValue, index) {
        if (index === void 0) { index = focusedInputIndex; }
        var newPageShowDates = getShowDatesFromFocused(innerValue, index);
        setPageShowDates(newPageShowDates);
        handlePickerValueChange(newPageShowDates);
    }
    function handlePickerValueChange(v) {
        if (!isSamePanel([v[0], pageShowDates[0]], mode)) {
            onPickerValueChange &&
                onPickerValueChange(isArray(v) ? v.map(function (v, i) { return v && v.format(getFormatByIndex(format, i)); }) : undefined, v);
        }
    }
    function getShowDatesFromFocused(dates, index) {
        if (index === void 0) { index = focusedInputIndex; }
        var prev = index === 0 || isSamePanel(dates, mode);
        if (isArray(dates) && dates.length < 2) {
            return getPageShowDatesByValue(dates[0] || getNow(utcOffset, timezone), mode, 'prev');
        }
        if (isArray(dates) && dates.length === 2) {
            if (dates[index]) {
                return getPageShowDatesByValue(dates[index], mode, prev ? 'prev' : 'next');
            }
            return getPageShowDatesByValue(dates[index === 0 ? 1 : 0] || getNow(utcOffset, timezone), mode, prev && !dates[index === 0 ? 1 : 0] ? 'prev' : 'next');
        }
    }
    function isSamePanel(innerValue, pickerMode) {
        if (innerValue && innerValue.length === 2 && isValidDayjsArray(innerValue)) {
            return (((pickerMode === 'date' || pickerMode === 'week') &&
                innerValue[0].isSame(innerValue[1], 'month')) ||
                ((pickerMode === 'month' || pickerMode === 'quarter') &&
                    innerValue[0].isSame(innerValue[1], 'year')) ||
                (pickerMode === 'year' &&
                    Math.floor(innerValue[0].year() / 10) === Math.floor(innerValue[1].year() / 10)));
        }
    }
    // get page show date by specify value
    function getPageShowDatesByValue(value, pickerMode, type) {
        if (value === void 0) { value = getNow(utcOffset, timezone); }
        if (pickerMode === void 0) { pickerMode = mode; }
        if (type === void 0) { type = 'prev'; }
        var prev = type === 'prev';
        switch (pickerMode) {
            case 'date':
            case 'week':
                return prev
                    ? [value, methods.add(value, 1, 'month')]
                    : [methods.subtract(value, 1, 'month'), value];
            case 'month':
            case 'quarter':
                return prev
                    ? [value, methods.add(value, 1, 'year')]
                    : [methods.subtract(value, 1, 'year'), value];
            case 'year':
                return prev
                    ? [value, methods.add(value, 10, 'year')]
                    : [methods.subtract(value, 10, 'year'), value];
            default:
                return [];
        }
    }
    function focusInput(index) {
        refInput.current &&
            refInput.current.focus &&
            refInput.current.focus(isHalfAvailable ? availableInputIndex : index);
    }
    function blurInput() {
        refInput.current && refInput.current.blur && refInput.current.blur();
    }
    function visibleChange(visible) {
        if (visible) {
            setTimeout(function () { return focusInput(); });
            setOpen(visible);
        }
        else {
            setOpen(false);
        }
    }
    // open or close popup
    function setOpen(visible) {
        onVisibleChange && onVisibleChange(visible);
        setPopupVisible(visible);
    }
    function onClear(e) {
        e.stopPropagation();
        var newValueShow = __spreadArray([], __read(panelValue), false);
        if (isHalfAvailable) {
            newValueShow[availableInputIndex] = undefined;
        }
        else {
            newValueShow = undefined;
        }
        setValue(newValueShow);
        setValueShow(newValueShow);
        onHandleChange(newValueShow);
        props.onClear && props.onClear();
    }
    function changeFocusedInputIndex(index, silent) {
        setFocusedInputIndex(index);
        if (panelValue && panelValue.length && !silent) {
            var newPageShowDates = getShowDatesFromFocused(panelValue, index);
            setPageShowDates(newPageShowDates);
            handlePickerValueChange(newPageShowDates);
        }
    }
    function isDisabledDate(date) {
        var selectedDisabled = typeof selectedDisabledDate === 'function' ? selectedDisabledDate(date) : false;
        var originDisabledDate = typeof disabledDate === 'function' ? disabledDate(date) : false;
        return originDisabledDate || selectedDisabled;
    }
    // Determine whether the input date is in the correct format
    function isValid(time) {
        return (isValidTimeString(time, format, focusedInputIndex) &&
            !isDisabledDate(getDayjsValue(time, format))
        // (panelValue[nextFocusedInputIndex]
        //   ? nextFocusedInputIndex === 0
        //     ? panelValue[nextFocusedInputIndex].isBefore(dayjs(time, format))
        //     : panelValue[nextFocusedInputIndex].isAfter(dayjs(time, format))
        //   : true)
        );
    }
    function onChangeInput(e) {
        var newValueShow = __spreadArray([], __read((panelValue || [])), false);
        var niv = e.target.value;
        setInputValue(niv);
        if (!mergedPopupVisible) {
            setOpen(true);
        }
        if (isValid(niv)) {
            newValueShow[focusedInputIndex] = getDayjsValue(niv, format);
            setValueShow(newValueShow);
            setFixedPageShowDates(newValueShow);
            setInputValue(undefined);
        }
    }
    function onBlurInput() {
        if (inputValue) {
            setInputValue(undefined);
        }
    }
    // Compare with the last value, trigger onChange only if the value changes
    function onHandleChange(newValue) {
        if (isDayjsArrayChange(mergedValue, newValue)) {
            var localValue = isArray(newValue)
                ? newValue.map(function (v) {
                    return getLocaleDayjsValue(toLocal(v, utcOffset, timezone), locale.dayjsLocale);
                })
                : undefined;
            onChange &&
                onChange(isArray(localValue)
                    ? localValue.map(function (v, i) { return v && v.format(getFormatByIndex(format, i)); })
                    : undefined, localValue);
        }
    }
    function onPressEnter() {
        if (isArray(valueShow) && valueShow.length) {
            if (inputValue && !isValid(inputValue)) {
                setInputValue(undefined);
            }
            else if (selectedLength !== 2) {
                switchFocusedInput();
            }
            else if (selectedLength === 2) {
                onConfirmValue(valueShow);
            }
        }
        else if (mergedPopupVisible) {
            setOpen(false);
        }
    }
    // Confirm and update component value
    function onConfirmValue(date, keepOpen) {
        var confirmValue = date || panelValue;
        if (!confirmValue || !confirmValue[0] || !confirmValue[1]) {
            return;
        }
        var sortedValues = getSortedDayjsArray(confirmValue);
        setValue(sortedValues);
        onHandleChange(sortedValues);
        if (triggerElement !== null && !keepOpen) {
            setOpen(false);
        }
    }
    // Callback when click the confirm button
    function onClickConfirmBtn() {
        onConfirmValue();
        var localePanelValue = panelValue.map(function (v) { return getLocaleDayjsValue(v, locale.dayjsLocale); });
        onOk &&
            onOk(localePanelValue.map(function (v, i) { return v && v.format(getFormatByIndex(format, i)); }), localePanelValue);
    }
    function getUnit() {
        switch (mode) {
            case 'date':
            case 'week':
                return 'date';
            case 'month':
                return 'month';
            case 'year':
                return 'year';
            default:
                return undefined;
        }
    }
    function outOfRange(date) {
        if (selectedLength !== 2) {
            return false;
        }
        var v = valueShow || mergedValue;
        if (focusedInputIndex === 0 && date.isAfter(v[1], getUnit())) {
            return true;
        }
        if (focusedInputIndex === 1 && date.isBefore(v[0], getUnit())) {
            return true;
        }
        return false;
    }
    // Callback when click the panel date cell
    function onSelectPanel(_, date) {
        var isOutOfRange = outOfRange(date) && firstRange.current;
        var newValueShow = resetRange && selectedLength === 2 && !isHalfAvailable ? [] : __spreadArray([], __read(panelValue), false);
        // if custom triggerElement, focused input index always 0 -> 1
        var focusedIndex = customTriggerElement
            ? selectedLength === 0 || selectedLength === 2
                ? 0
                : 1
            : focusedInputIndex;
        var newDate = showTime ? getValueWithTime(date, timeValues[focusedIndex]) : date;
        if (isOutOfRange) {
            newValueShow[focusedIndex] = newDate;
            newValueShow[1 ^ focusedIndex] = undefined;
        }
        else {
            newValueShow[focusedIndex] = newDate;
        }
        var sortedValueShow = getSortedDayjsArray(newValueShow);
        onSelectValueShow(sortedValueShow);
        setInputValue(undefined);
        setHoverPlaceholderValue(undefined);
        var newSelectedLength = getAvailableDayjsLength(newValueShow);
        if (resetRange) {
            if (selectedLength === 0 || (selectedLength === 2 && !isHalfAvailable)) {
                customTriggerElement ? setFocusedInputIndex(1) : switchFocusedInput(true);
            }
            else if (!showTime) {
                onConfirmValue(newValueShow);
            }
        }
        else if (newSelectedLength <= 1) {
            switchFocusedInput(true);
        }
        else if (selectedLength === 2 && firstRange.current && !isHalfAvailable) {
            firstRange.current = false;
            switchFocusedInput(true);
            if (!showTime && !isOutOfRange) {
                onConfirmValue(newValueShow, true);
            }
        }
        else {
            firstRange.current = false;
            if (!showTime && !isOutOfRange) {
                onConfirmValue(newValueShow);
            }
        }
    }
    // Callback when click TimePicker
    function onTimePickerSelect(index, _, time) {
        var newValueShow = isArray(panelValue) ? __spreadArray([], __read(panelValue), false) : [];
        var newTimeValue = getValueWithTime(newValueShow[index] || getNow(utcOffset, timezone), time);
        newValueShow[index] = newTimeValue;
        onSelectValueShow(newValueShow);
    }
    function onSelectValueShow(newValueShow) {
        setValueShow(newValueShow);
        setValueShowHover(undefined);
        var sortedValues = getSortedDayjsArray(newValueShow);
        var zoneValues = sortedValues.map(function (v) {
            return getLocaleDayjsValue(toLocal(v, utcOffset, timezone), locale.dayjsLocale);
        });
        onSelect &&
            onSelect(zoneValues.map(function (v, i) { return v && v.format(getFormatByIndex(format, i)); }), zoneValues, { type: focusedInputIndex === 1 ? 'end' : 'start' });
    }
    // Switch to next focused input
    function switchFocusedInput(silent) {
        changeFocusedInputIndex(nextFocusedInputIndex, silent);
        setTimeout(function () { return focusInput(nextFocusedInputIndex); });
    }
    // Callback when mouse entered the date cell
    function onMouseEnterCell(date, disabled) {
        var newValueShowHover = __spreadArray([], __read((panelValue || [])), false);
        var needShowHover = resetRange ? selectedLength === 1 : selectedLength !== 0;
        if (!disabled && needShowHover && !outOfRange(date)) {
            newValueShowHover[focusedInputIndex] = getValueWithTime(date, timeValues[focusedInputIndex]);
            setValueShowHover(newValueShowHover);
            setInputValue(undefined);
        }
        if (!disabled) {
            var placeHolderValue = showTime
                ? getValueWithTime(date, timeValues[focusedInputIndex])
                : date;
            setHoverPlaceholderValue(placeHolderValue
                .locale(locale.dayjsLocale)
                .format(getFormatByIndex(format, focusedInputIndex)));
        }
    }
    function onMouseLeaveCell() {
        setValueShowHover(undefined);
        setHoverPlaceholderValue(undefined);
    }
    function isValidDayjsArray(sv) {
        return sv && isArray(sv) && sv.length === 2 && isDayjs(sv[0]) && isDayjs(sv[1]);
    }
    // Determine whether the value entered in the shortcut is in the correct format
    function isValidShortcut(shortcut) {
        var sv = typeof shortcut.value === 'function' && shortcut.value();
        return isValidDayjsArray(sv);
    }
    function clearShortcutsTimer() {
        clearTimeout(shortcutEnterTimer.current);
        clearTimeout(shortcutLeaveTimer.current);
        shortcutEnterTimer.current = null;
        shortcutLeaveTimer.current = null;
    }
    // Callback when mouse entered the shortcuts
    function onMouseEnterShortcut(shortcut) {
        clearShortcutsTimer();
        shortcutEnterTimer.current = setTimeout(function () {
            if (isValidShortcut(shortcut)) {
                var nv = getDayjsValue(shortcut.value(), format, utcOffset, timezone);
                setShortcutsValue(nv);
                setFixedPageShowDates(nv);
            }
        }, 50);
    }
    // Callback when mouse leaved the shortcuts
    function onMouseLeaveShortcut() {
        clearShortcutsTimer();
        shortcutLeaveTimer.current = setTimeout(function () {
            setShortcutsValue(undefined);
            setFixedPageShowDates(valueShow || mergedValue || [getNow(utcOffset, timezone), getNow(utcOffset, timezone)]);
        }, 50);
    }
    // Callback when click the shortcuts button
    function onHandleSelectShortcut(shortcut) {
        onSelectShortcut && onSelectShortcut(shortcut);
        if (isValidShortcut(shortcut)) {
            var time = getDayjsValue(shortcut.value(), format, utcOffset, timezone);
            onConfirmValue(time);
        }
    }
    // Modify panel date (the value of the panel itself, not the component value)
    function changePageShowDates(type, unit, num) {
        if (num === void 0) { num = 1; }
        var index = type === 'prev' ? 0 : 1;
        var newPageShowDates = __spreadArray([], __read(mergedPageShowDate), false);
        if (type === 'prev') {
            newPageShowDates[index] = methods.subtract(mergedPageShowDate[index], num, unit);
        }
        if (type === 'next') {
            newPageShowDates[index] = methods.add(mergedPageShowDate[index], num, unit);
        }
        newPageShowDates = getPageShowDatesByValue(newPageShowDates[index], mode, type);
        setFixedPageShowDates(newPageShowDates);
    }
    // Callback when click the prev or next button
    function getHeaderOperations(pickerMode) {
        if (pickerMode === void 0) { pickerMode = mode; }
        if (pickerMode === 'date' || pickerMode === 'week') {
            return {
                onPrev: function () { return changePageShowDates('prev', 'month'); },
                onNext: function () { return changePageShowDates('next', 'month'); },
                onSuperPrev: function () { return changePageShowDates('prev', 'year'); },
                onSuperNext: function () { return changePageShowDates('next', 'year'); },
            };
        }
        if (pickerMode === 'month' || pickerMode === 'quarter') {
            return {
                onSuperPrev: function () { return changePageShowDates('prev', 'year'); },
                onSuperNext: function () { return changePageShowDates('next', 'year'); },
            };
        }
        if (pickerMode === 'year') {
            return {
                onSuperPrev: function () { return changePageShowDates('prev', 'year', 10); },
                onSuperNext: function () { return changePageShowDates('next', 'year', 10); },
            };
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
            prefixCls: getPrefixCls('picker'),
            showTime: showTime,
            shortcuts: shortcuts,
            onMouseEnterShortcut: onMouseEnterShortcut,
            onMouseLeaveShortcut: onMouseLeaveShortcut,
            onSelectShortcut: onHandleSelectShortcut,
        };
        var shouldShowFooter = (showTime && panelModes[0] === 'date' && panelModes[1] === 'date') ||
            extra ||
            (isArray(shortcuts) && shortcuts.length && !shortcutsPlacementLeft);
        var content = (React.createElement(React.Fragment, null,
            React.createElement(RangePickerPanel, __assign({}, props, getHeaderOperations(), { getHeaderOperations: getHeaderOperations, setRangePageShowDates: setFixedPageShowDates, pageShowDates: mergedPageShowDate, value: panelValue, format: format, onSelectPanel: onSelectPanel, onMouseEnterCell: onMouseEnterCell, onMouseLeaveCell: onMouseLeaveCell, disabledDate: function (current) { return isDisabledDate(current); }, disabledTime: disabledTime, mode: mode, localeName: locale.dayjsLocale, showTime: showTime, timeValues: shortcutsValue || timeValues, onTimePickerSelect: onTimePickerSelect, popupVisible: mergedPopupVisible, disabledTimePickerIndex: disabledTimePickerIndex, isTimePanel: isTimePanel, valueShowHover: valueShowHover, panelModes: panelModes, setPanelModes: setPanelModes })),
            !!shouldShowFooter && (React.createElement(Footer, __assign({}, shortcutsProps, { DATEPICKER_LOCALE: locale.DatePicker, disabled: !(isArray(panelValue) && panelValue[0] && panelValue[1]), onClickConfirmBtn: onClickConfirmBtn, extra: extra, shortcutsPlacementLeft: shortcutsPlacementLeft, onClickSelectTimeBtn: onClickSelectTimeBtn, isTimePanel: isTimePanel })))));
        var contentWithShortcuts = shortcutsPlacementLeft ? (React.createElement(React.Fragment, null,
            React.createElement(Shortcuts, __assign({ ref: refShortcuts }, shortcutsProps)),
            React.createElement("div", { ref: refPanel, className: prefixCls + "-panel-wrapper" }, content))) : (content);
        var panelNode = typeof panelRender === 'function' ? panelRender(contentWithShortcuts) : contentWithShortcuts;
        return (React.createElement("div", { className: classNames, onClick: function () { return focusInput(); }, style: panelOnly ? style : {} }, panelNode));
    }
    var size = props.size || ctxSize;
    var placeholders = isArray(placeholder) ? placeholder : locale.DatePicker.placeholders[mode];
    var suffixIcon = icons && icons.inputSuffix === null
        ? null
        : (icons && icons.inputSuffix) || (showTime ? React.createElement(IconCalendarClock, null) : React.createElement(IconCalendar, null));
    var baseInputProps = {
        style: style,
        className: className,
        popupVisible: mergedPopupVisible,
        format: format,
        disabled: disabled,
        error: error,
        status: status,
        size: size,
        onPressEnter: onPressEnter,
        onClear: onClear,
        suffixIcon: suffixIcon,
        editable: editable,
        allowClear: allowClear,
        prefix: props.prefix,
    };
    var triggerDisabled = isArray(disabled) ? disabled[0] && disabled[1] : disabled;
    return (React.createElement(PickerContext.Provider, { value: { utcOffset: utcOffset, timezone: timezone, weekStart: weekStart } }, triggerElement === null ? (renderPopup(true)) : (React.createElement(Trigger, __assign({ popup: renderPopup, trigger: "click", clickToClose: false, position: position, disabled: triggerDisabled, popupAlign: triggerPopupAlign, getPopupContainer: getPopupContainer, onVisibleChange: visibleChange, popupVisible: mergedPopupVisible, classNames: "slideDynamicOrigin", unmountOnExit: unmountOnExit }, triggerProps), triggerElement || (React.createElement(DateInputRange, __assign({}, pickDataAttributes(props), baseInputProps, { inputProps: inputProps, ref: refInput, placeholder: placeholders, value: valueShow || mergedValue, onChange: onChangeInput, inputValue: hoverPlaceholderValue || inputValue, changeFocusedInputIndex: changeFocusedInputIndex, focusedInputIndex: focusedInputIndex, isPlaceholder: !!hoverPlaceholderValue, separator: separator, onBlur: onBlurInput })))))));
};
Picker.displayName = 'RangePicker';
export default Picker;
