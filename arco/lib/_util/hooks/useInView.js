"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useIntersectionObserver_1 = __importStar(require("./useIntersectionObserver"));
function useInView(props) {
    var defaultInView = props.defaultInView, _a = props.unobserverOnEnter, unobserverOnEnter = _a === void 0 ? true : _a, onChange = props.onChange, target = props.target, rest = __rest(props, ["defaultInView", "unobserverOnEnter", "onChange", "target"]);
    // if intersect observer is not supported
    var _b = __read((0, react_1.useState)(useIntersectionObserver_1.supportIntersectionObserver ? defaultInView : true), 2), inView = _b[0], setInView = _b[1];
    var observerCallback = (0, react_1.useCallback)(function (_a, observer) {
        var _b = __read(_a, 1), entry = _b[0];
        var inThreshold = observer.thresholds.some(function (t) { return entry.intersectionRatio >= t; });
        var newInView = inThreshold && entry.isIntersecting;
        setInView(newInView);
        onChange === null || onChange === void 0 ? void 0 : onChange(newInView, entry);
        if (newInView && unobserverOnEnter) {
            observer.unobserve(entry.target);
        }
    }, [onChange, unobserverOnEnter]);
    var _c = (0, useIntersectionObserver_1.default)(observerCallback, rest), cor = _c.cor, dor = _c.dor, observer = _c.observer;
    (0, react_1.useEffect)(function () {
        var noNeedObserver = defaultInView && unobserverOnEnter;
        if (noNeedObserver) {
            dor();
        }
        else if (target) {
            cor(target);
        }
        return dor;
    }, [target, defaultInView, unobserverOnEnter]);
    return {
        inView: inView,
        observer: observer,
    };
}
exports.default = useInView;
