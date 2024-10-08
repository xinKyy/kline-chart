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
import React, { useContext, useMemo } from 'react';
import merge from 'lodash/merge';
import { dayjs } from '../../../_util/dayjs';
import cs from '../../../_util/classNames';
import { ConfigContext } from '../../../ConfigProvider';
import Header from '../header';
import Body from '../body';
import YearPanel from '../year';
import { padStart } from '../../../_util/pad';
function MonthPicker(props) {
    var pageShowDate = props.pageShowDate, style = props.style, onMouseEnterCell = props.onMouseEnterCell, onMouseLeaveCell = props.onMouseLeaveCell, dateRender = props.dateRender, disabledDate = props.disabledDate, value = props.value, locale = props.locale, isRangePicker = props.isRangePicker, onSelect = props.onSelect, rangeValues = props.rangeValues, onSuperPrev = props.onSuperPrev, onSuperNext = props.onSuperNext, format = props.format, getHeaderOperations = props.getHeaderOperations, setPageShowDate = props.setPageShowDate, icons = props.icons, panelMode = props.panelMode, setPanelMode = props.setPanelMode, rest = __rest(props, ["pageShowDate", "style", "onMouseEnterCell", "onMouseLeaveCell", "dateRender", "disabledDate", "value", "locale", "isRangePicker", "onSelect", "rangeValues", "onSuperPrev", "onSuperNext", "format", "getHeaderOperations", "setPageShowDate", "icons", "panelMode", "setPanelMode"]);
    var _a = useContext(ConfigContext), globalLocale = _a.locale, getPrefixCls = _a.getPrefixCls, rtl = _a.rtl;
    var DATEPICKER_LOCALE = merge(globalLocale.DatePicker, locale);
    var CALENDAR_LOCALE = DATEPICKER_LOCALE.Calendar;
    var prefixCls = getPrefixCls('panel-month');
    var classNames = cs(prefixCls);
    var bodyProps = isRangePicker ? { rangeValues: rangeValues } : { value: value };
    var showYear = pageShowDate.year();
    var rows = useMemo(function () {
        var MONTHS = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ].map(function (month, index) {
            return {
                name: CALENDAR_LOCALE.month.short[month],
                time: dayjs(showYear + "-" + padStart(index + 1, 2, '0'), 'YYYY-MM').endOf('month'),
            };
        });
        var monthGroup = Array(4);
        for (var i = 0; i < 4; i++) {
            monthGroup[i] = MONTHS.slice(i * 3, 3 * (i + 1));
        }
        return monthGroup;
    }, [showYear, CALENDAR_LOCALE]);
    function renderCalendar() {
        return (React.createElement(Body, __assign({}, rest, bodyProps, { prefixCls: getPrefixCls('picker'), rows: rows, onSelectDate: onSelect, isSameTime: function (current, target) { return current.isSame(target, 'month'); }, onMouseEnterCell: onMouseEnterCell, onMouseLeaveCell: onMouseLeaveCell, dateRender: dateRender, disabledDate: disabledDate, CALENDAR_LOCALE: CALENDAR_LOCALE, mode: "month", format: format })));
    }
    var headerOperations = { onSuperPrev: onSuperPrev, onSuperNext: onSuperNext };
    function onChangePanel(mode) {
        setPanelMode(mode);
    }
    if (panelMode === 'year') {
        return (React.createElement(YearPanel, __assign({}, getHeaderOperations(panelMode), { pageShowDate: pageShowDate, onSelect: function (_, date) {
                setPanelMode('month');
                setPageShowDate(date);
            }, disabledDate: disabledDate })));
    }
    return (React.createElement("div", { className: classNames, style: style },
        React.createElement(Header, __assign({}, headerOperations, { DATEPICKER_LOCALE: DATEPICKER_LOCALE, icons: icons, prefixCls: getPrefixCls('picker'), value: pageShowDate, mode: panelMode, onChangePanel: onChangePanel, rtl: rtl })),
        renderCalendar()));
}
export default MonthPicker;
