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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbaToHex = exports.rgbToHex = exports.hexToRgb = exports.formatInputToHSVA = exports.formatInputToRgb = exports.convertHexToDecimal = exports.parseIntFromHex = exports.rgbToHsv = exports.hsvToRgb = void 0;
// https://github.com/scttcper/tinycolor
var hsvToRgb = function (h, s, v) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
};
exports.hsvToRgb = hsvToRgb;
var rgbToHsv = function (r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
};
exports.rgbToHsv = rgbToHsv;
// <http://www.w3.org/TR/css3-values/#integers>
var CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
var parseIntFromHex = function (val) {
    return parseInt(val, 16);
};
exports.parseIntFromHex = parseIntFromHex;
var convertHexToDecimal = function (h) {
    return (0, exports.parseIntFromHex)(h) / 255;
};
exports.convertHexToDecimal = convertHexToDecimal;
var formatInputToRgb = function (color) {
    var match = matchers.rgb.exec(color);
    if (match) {
        return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: parseFloat(match[4]),
        };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1]),
            g: (0, exports.parseIntFromHex)(match[2]),
            b: (0, exports.parseIntFromHex)(match[3]),
            a: (0, exports.convertHexToDecimal)(match[4]),
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1]),
            g: (0, exports.parseIntFromHex)(match[2]),
            b: (0, exports.parseIntFromHex)(match[3]),
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1] + match[1]),
            g: (0, exports.parseIntFromHex)(match[2] + match[2]),
            b: (0, exports.parseIntFromHex)(match[3] + match[3]),
            a: (0, exports.convertHexToDecimal)(match[4] + match[4]),
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1] + match[1]),
            g: (0, exports.parseIntFromHex)(match[2] + match[2]),
            b: (0, exports.parseIntFromHex)(match[3] + match[3]),
        };
    }
    return false;
};
exports.formatInputToRgb = formatInputToRgb;
var formatInputToHSVA = function (color) {
    var _a;
    var rgba = (0, exports.formatInputToRgb)(color);
    if (rgba) {
        var hsv = (0, exports.rgbToHsv)(rgba.r, rgba.g, rgba.b);
        return __assign(__assign({}, hsv), { a: (_a = rgba.a) !== null && _a !== void 0 ? _a : 1 });
    }
    return {
        h: 0,
        s: 1,
        v: 1,
        a: 1,
    };
};
exports.formatInputToHSVA = formatInputToHSVA;
var hexToRgb = function (color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    var match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1]),
            g: (0, exports.parseIntFromHex)(match[2]),
            b: (0, exports.parseIntFromHex)(match[3]),
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: (0, exports.parseIntFromHex)(match[1] + match[1]),
            g: (0, exports.parseIntFromHex)(match[2] + match[2]),
            b: (0, exports.parseIntFromHex)(match[3] + match[3]),
        };
    }
    return false;
};
exports.hexToRgb = hexToRgb;
var rgbToHex = function (r, g, b) {
    var hex = [
        Math.round(r).toString(16).padStart(2, '0'),
        Math.round(g).toString(16).padStart(2, '0'),
        Math.round(b).toString(16).padStart(2, '0'),
    ];
    return hex.join('').toUpperCase();
};
exports.rgbToHex = rgbToHex;
var rgbaToHex = function (r, g, b, a) {
    var hex = [
        Math.round(r).toString(16).padStart(2, '0'),
        Math.round(g).toString(16).padStart(2, '0'),
        Math.round(b).toString(16).padStart(2, '0'),
        Math.round(a * 255)
            .toString(16)
            .padStart(2, '0'),
    ];
    return hex.join('').toUpperCase();
};
exports.rgbaToHex = rgbaToHex;
