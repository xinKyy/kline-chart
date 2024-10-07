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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatInputToHSVA, hsvToRgb, rgbaToHex, rgbToHex } from '../../_util/color';
import useMergeValue from '../../_util/hooks/useMergeValue';
import useIsFirstRender from '../../_util/hooks/useIsFirstRender';
export var useColorPicker = function (props) {
    var format = props.format, onChange = props.onChange, disabledAlpha = props.disabledAlpha;
    var isFirstRender = useIsFirstRender();
    var _a = __read(useMergeValue('', props), 2), value = _a[0], setValue = _a[1];
    var formatInput = useMemo(function () {
        return formatInputToHSVA(value);
    }, [value]);
    var _b = __read(useMergeValue(false, {
        defaultValue: props.defaultPopupVisible,
        value: props.popupVisible,
    }), 2), popupVisible = _b[0], setPopupVisible = _b[1];
    var _c = __read(useState({
        h: formatInput.h,
        s: formatInput.s,
        v: formatInput.v,
    }), 2), hsv = _c[0], setHsv = _c[1];
    var _d = __read(useState(formatInput.a), 2), alpha = _d[0], setAlpha = _d[1];
    var color = useMemo(function () {
        var rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        return {
            hsv: hsv,
            rgb: rgb,
            hex: hex,
        };
    }, [hsv]);
    var colorString = useMemo(function () {
        var _a = color.rgb, r = _a.r, g = _a.g, b = _a.b;
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toFixed(2) + ")";
    }, [color, alpha]);
    var formatValue = useMemo(function () {
        var _a = color.rgb, r = _a.r, g = _a.g, b = _a.b;
        if (format === 'rgb') {
            return alpha < 1 ? "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toFixed(2) + ")" : "rgb(" + r + ", " + g + ", " + b + ")";
        }
        return alpha < 1 ? "#" + rgbaToHex(r, g, b, alpha) : "#" + rgbToHex(r, g, b);
    }, [color, alpha, format]);
    useEffect(function () {
        setValue(formatValue);
        !isFirstRender && (onChange === null || onChange === void 0 ? void 0 : onChange(formatValue));
    }, [formatValue]);
    var onVisibleChange = useCallback(function (newVisible) {
        if (newVisible && value !== formatValue) {
            var h = formatInput.h, s = formatInput.s, v = formatInput.v, a = formatInput.a;
            setHsv({ h: h, s: s, v: v });
            setAlpha(a);
        }
        if (newVisible !== popupVisible) {
            props.onVisibleChange && props.onVisibleChange(newVisible);
            if (!('popupVisible' in props)) {
                setPopupVisible(newVisible);
            }
        }
    }, [props.onVisibleChange, popupVisible, value]);
    var onHsvChange = function (_value) {
        setHsv(_value);
        if (disabledAlpha && alpha !== 100) {
            setAlpha(100);
        }
    };
    var onAlphaChange = function (_value) {
        setAlpha(_value);
    };
    return {
        value: value,
        popupVisible: popupVisible,
        color: color,
        alpha: alpha,
        colorString: colorString,
        onHsvChange: onHsvChange,
        onAlphaChange: onAlphaChange,
        onVisibleChange: onVisibleChange,
    };
};
