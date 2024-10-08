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
var Trigger_1 = __importDefault(require("../Trigger"));
var input_1 = __importDefault(require("../_class/picker/input"));
var is_1 = require("../_util/is");
var classNames_1 = __importDefault(require("../_util/classNames"));
var ConfigProvider_1 = require("../ConfigProvider");
var omit_1 = __importDefault(require("../_util/omit"));
var dayjs_1 = require("../_util/dayjs");
var IconCalendar_1 = __importDefault(require("../../icon/react-icon-cjs/IconCalendar"));
var IconCalendarClock_1 = __importDefault(require("../../icon/react-icon-cjs/IconCalendarClock"));
var footer_1 = __importDefault(require("./panels/footer"));
var shortcuts_1 = __importDefault(require("./panels/shortcuts"));
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var context_1 = __importDefault(require("./context"));
var usePrevious_1 = __importDefault(require("../_util/hooks/usePrevious"));
var useUpdate_1 = __importDefault(require("../_util/hooks/useUpdate"));
var util_1 = require("./util");
var pick_1 = require("../_util/pick");
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
    var _a = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _a.getPrefixCls, locale = _a.locale, ctxSize = _a.size, componentConfig = _a.componentConfig, rtl = _a.rtl;
    if (rtl) {
        defaultProps.position = 'br';
    }
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.DatePicker);
    var allowClear = props.allowClear, className = props.className, style = props.style, placeholder = props.placeholder, getPopupContainer = props.getPopupContainer, disabled = props.disabled, position = props.position, error = props.error, status = props.status, unmountOnExit = props.unmountOnExit, editable = props.editable, triggerProps = props.triggerProps, picker = props.picker, shortcuts = props.shortcuts, onSelect = props.onSelect, onVisibleChange = props.onVisibleChange, propsValue = props.value, onChange = props.onChange, icons = props.icons, disabledDate = props.disabledDate, showTime = props.showTime, showNowBtn = props.showNowBtn, onSelectShortcut = props.onSelectShortcut, extra = props.extra, shortcutsPlacementLeft = props.shortcutsPlacementLeft, onOk = props.onOk, defaultPickerValue = props.defaultPickerValue, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, triggerElement = props.triggerElement, utcOffset = props.utcOffset, timezone = props.timezone, panelRender = props.panelRender, inputProps = props.inputProps;
    var prefixCls = getPrefixCls('picker');
    var DATEPICKER_LOCALE = locale.DatePicker;
    var weekStart = (0, is_1.isUndefined)(props.dayStartOfWeek)
        ? (0, util_1.getDefaultWeekStart)(locale.dayjsLocale)
        : props.dayStartOfWeek;
    // picker.props.pickerType: Compatible with defaultProps
    var mode = props.mode || picker.props.pickerType;
    var refInput = (0, react_1.useRef)(null);
    var refPanel = (0, react_1.useRef)(null);
    var refShortcuts = (0, react_1.useRef)(null);
    var realFormat = getFormat(props);
    var format = realFormat;
    if (typeof format === 'function') {
        format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    }
    function getDefaultValue() {
        var value;
        if (props.value) {
            value = (0, dayjs_1.getDayjsValue)(props.value, format, utcOffset, timezone);
        }
        else {
            value = (0, dayjs_1.getDayjsValue)(props.defaultValue, format, utcOffset, timezone);
        }
        return value;
    }
    var _b = __read((0, react_1.useState)(getDefaultValue()), 2), value = _b[0], setValue = _b[1];
    var _c = __read((0, react_1.useState)(props.popupVisible), 2), popupVisible = _c[0], setPopupVisible = _c[1];
    var _d = __read((0, react_1.useState)(false), 2), isTimePanel = _d[0], setIsTimePanel = _d[1];
    var _e = __read((0, react_1.useState)(), 2), hoverPlaceholderValue = _e[0], setHoverPlaceholderValue = _e[1];
    var mergedPopupVisible = 'popupVisible' in props ? props.popupVisible : popupVisible;
    var mergedValue = 'value' in props ? (0, dayjs_1.getDayjsValue)(propsValue, format, utcOffset, timezone) : value;
    var defaultPageShowDate = mergedValue || (0, dayjs_1.getDayjsValue)(defaultPickerValue, format) || (0, dayjs_1.getNow)();
    var _f = __read((0, react_1.useState)(), 2), inputValue = _f[0], setInputValue = _f[1];
    var _g = __read((0, react_1.useState)(), 2), valueShow = _g[0], setValueShow = _g[1];
    var _h = __read((0, react_1.useState)(), 2), shortcutValue = _h[0], setShortcutValue = _h[1];
    var _j = __read((0, react_1.useState)(defaultPageShowDate), 2), pageShowDate = _j[0], setPageShowDate = _j[1];
    var mergedPageShowDate = (0, dayjs_1.getDayjsValue)(pickerValue, format) || pageShowDate;
    var panelValue = shortcutValue || valueShow || mergedValue;
    var _k = __read((0, react_1.useState)(mode), 2), panelMode = _k[0], setPanelMode = _k[1];
    var defaultTimeValue = ((0, is_1.isObject)(showTime) &&
        (0, dayjs_1.getDayjsValue)(showTime.defaultValue, showTime.format || 'HH:mm:ss')) ||
        (0, dayjs_1.getNow)(utcOffset, timezone);
    var timeValue = panelValue || defaultTimeValue;
    function focusInput() {
        refInput.current && refInput.current.blur && refInput.current.focus();
    }
    function blurInput() {
        refInput.current && refInput.current.blur && refInput.current.blur();
    }
    var previousUtcOffset = (0, usePrevious_1.default)(utcOffset);
    var previousTimezone = (0, usePrevious_1.default)(timezone);
    // when timezone or utcOffset change changed
    (0, useUpdate_1.default)(function () {
        if (value && (previousUtcOffset !== utcOffset || timezone !== previousTimezone)) {
            var localValue = (0, dayjs_1.toLocal)(value, previousUtcOffset, previousTimezone);
            setValue((0, dayjs_1.toTimezone)(localValue, utcOffset, timezone));
        }
    }, [utcOffset, previousUtcOffset, timezone, previousTimezone]);
    (0, react_1.useEffect)(function () {
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
        var pv = (0, util_1.getLocaleDayjsValue)(panelValue, locale.dayjsLocale);
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
            var newTime = now ? date : (0, dayjs_1.getValueWithTime)(date, timeValue);
            setValueShow(newTime);
            setPageShowDate(newTime);
            var localTime = (0, util_1.getLocaleDayjsValue)((0, dayjs_1.toLocal)(newTime, utcOffset, timezone), locale.dayjsLocale);
            onSelect && onSelect(localTime.format(format), localTime);
        }
        else {
            var localTime = (0, util_1.getLocaleDayjsValue)((0, dayjs_1.toLocal)(date, utcOffset, timezone).locale(locale.dayjsLocale), locale.dayjsLocale);
            onSelect && onSelect(localTime ? localTime.format(format) : undefined, localTime);
            setValue(date);
            onHandleChange(date);
            setOpen(false);
        }
    }
    function onHandleChange(newValue) {
        if ((0, dayjs_1.isDayjsChange)(newValue, mergedValue)) {
            var localValue = (0, util_1.getLocaleDayjsValue)((0, dayjs_1.toLocal)(newValue, utcOffset, timezone), locale.dayjsLocale);
            onChange && onChange(localValue ? localValue.format(format) : undefined, localValue);
        }
    }
    function onTimePickerSelect(_, time) {
        var _valueShow = panelValue || (0, dayjs_1.getNow)(utcOffset, timezone);
        var newValueShow = (0, dayjs_1.getValueWithTime)(_valueShow, time);
        setValueShow(newValueShow);
        var localNewValueShow = (0, util_1.getLocaleDayjsValue)((0, dayjs_1.toLocal)(newValueShow, utcOffset, timezone), locale.dayjsLocale);
        onSelect && onSelect(localNewValueShow.format(format), localNewValueShow);
    }
    function isValid(time) {
        return (typeof time === 'string' &&
            (0, dayjs_1.dayjs)(time, format).format(format) === time &&
            (typeof disabledDate === 'function' ? !disabledDate((0, dayjs_1.dayjs)(time, format)) : true));
    }
    function onChangeInput(e) {
        var niv = e.target.value;
        setInputValue(niv);
        if (!mergedPopupVisible) {
            setOpen(true);
        }
        if (isValid(niv)) {
            // https://github.com/arco-design/arco-design/issues/1986
            var newValue = (0, dayjs_1.getDayjsValue)(niv, format);
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
            newPageShowDate = dayjs_1.methods.subtract(mergedPageShowDate, num, unit);
        }
        if (type === 'next') {
            newPageShowDate = dayjs_1.methods.add(mergedPageShowDate, num, unit);
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
        var now = (0, util_1.getLocaleDayjsValue)((0, dayjs_1.getNow)(utcOffset, timezone), locale.dayjsLocale);
        handlePickerValueChange(now);
        onHandleSelect(now.format(format), now, true);
    }
    function onMouseEnterCell(value, disabled) {
        if (!disabled) {
            var placeHolderValue = showTime ? (0, dayjs_1.getValueWithTime)(value, timeValue) : value;
            setHoverPlaceholderValue(typeof realFormat === 'function'
                ? realFormat(value)
                : placeHolderValue.locale(locale.dayjsLocale).format(format));
        }
    }
    function onMouseLeaveCell() {
        setHoverPlaceholderValue(undefined);
    }
    function onMouseEnterShortcut(shortcut) {
        if (typeof shortcut.value === 'function' && (0, is_1.isDayjs)(shortcut.value())) {
            var sv = (0, dayjs_1.getDayjsValue)(shortcut.value(), format, utcOffset, timezone);
            setPageShowDate(sv);
            handlePickerValueChange(sv);
            setShortcutValue(sv);
        }
    }
    function onMouseLeaveShortcut() {
        var newValue = valueShow || mergedValue || (0, dayjs_1.getNow)(utcOffset, timezone);
        setShortcutValue(undefined);
        setPageShowDate(newValue);
        handlePickerValueChange(newValue);
    }
    function onHandleSelectShortcut(shortcut) {
        onSelectShortcut && onSelectShortcut(shortcut);
        if (typeof shortcut.value === 'function' && (0, is_1.isDayjs)(shortcut.value())) {
            var time = (0, dayjs_1.getDayjsValue)(shortcut.value(), format, utcOffset, timezone);
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
        var classNames = (0, classNames_1.default)(prefixCls + "-container", (_a = {},
            _a[prefixCls + "-panel-only"] = panelOnly,
            _a[prefixCls + "-container-shortcuts-placement-left"] = (0, is_1.isArray)(shortcuts) && shortcutsPlacementLeft,
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
            ((0, is_1.isArray)(shortcuts) && shortcuts.length && !shortcutsPlacementLeft) ||
            (!showTime && panelMode === 'date' && showNowBtn);
        var content = (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.cloneElement(picker, __assign(__assign(__assign({}, (0, omit_1.default)(props, ['style'])), getHeaderOperations()), { getHeaderOperations: getHeaderOperations, onSelect: onHandleSelect, onTimePickerSelect: onTimePickerSelect, onSelectNow: onSelectNow, popupVisible: mergedPopupVisible, format: format, value: panelValue, pageShowDate: mergedPageShowDate, localeName: locale.dayjsLocale, setPageShowDate: function (v) {
                    setPageShowDate(v);
                    handlePickerValueChange(v);
                }, timeValue: timeValue, isTimePanel: isTimePanel, panelMode: panelMode, setPanelMode: setPanelMode, onMouseEnterCell: onMouseEnterCell, onMouseLeaveCell: onMouseLeaveCell })),
            !!shouldShowFooter && (react_1.default.createElement(footer_1.default, __assign({}, shortcutsProps, { DATEPICKER_LOCALE: DATEPICKER_LOCALE, disabled: !panelValue, onClickConfirmBtn: onClickConfirmBtn, extra: extra, mode: panelMode, shortcutsPlacementLeft: shortcutsPlacementLeft, onClickSelectTimeBtn: onClickSelectTimeBtn, isTimePanel: isTimePanel })))));
        var contentWithShortcuts = shortcutsPlacementLeft ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(shortcuts_1.default, __assign({ ref: refShortcuts }, shortcutsProps)),
            react_1.default.createElement("div", { ref: refPanel, className: prefixCls + "-panel-wrapper" }, content))) : (content);
        var panelNode = typeof panelRender === 'function' ? panelRender(contentWithShortcuts) : contentWithShortcuts;
        return (react_1.default.createElement("div", { className: classNames, onClick: function () {
                refInput.current && refInput.current.focus && refInput.current.focus();
            }, style: panelOnly ? style : {} }, panelNode));
    }
    var size = props.size || ctxSize;
    var suffixIcon = icons && icons.inputSuffix === null
        ? null
        : (icons && icons.inputSuffix) || (showTime ? react_1.default.createElement(IconCalendarClock_1.default, null) : react_1.default.createElement(IconCalendar_1.default, null));
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
    return (react_1.default.createElement(context_1.default.Provider, { value: { utcOffset: utcOffset, timezone: timezone, weekStart: weekStart } }, triggerElement === null ? (renderPopup(true)) : (react_1.default.createElement(Trigger_1.default, __assign({ popup: renderPopup, trigger: "click", clickToClose: false, position: position, disabled: disabled, popupAlign: triggerPopupAlign, getPopupContainer: getPopupContainer, onVisibleChange: visibleChange, popupVisible: mergedPopupVisible, classNames: "slideDynamicOrigin", unmountOnExit: unmountOnExit }, triggerProps), triggerElement || (react_1.default.createElement(input_1.default, __assign({}, (0, pick_1.pickDataAttributes)(props), baseInputProps, { ref: refInput, placeholder: placeholder || DATEPICKER_LOCALE.placeholder[mode], popupVisible: mergedPopupVisible, value: valueShow || mergedValue, inputValue: hoverPlaceholderValue || inputValue, prefixCls: prefixCls, onChange: onChangeInput, isPlaceholder: !!hoverPlaceholderValue, inputProps: inputProps })))))));
};
exports.default = Picker;
