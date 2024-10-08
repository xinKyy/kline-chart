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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigContext = exports.DefaultConfigProviderProps = void 0;
var react_1 = __importStar(require("react"));
var default_1 = __importDefault(require("../locale/default"));
var Empty_1 = __importDefault(require("../Empty"));
function renderEmpty(componentName) {
    switch (componentName) {
        default:
            return react_1.default.createElement(Empty_1.default, null);
    }
}
exports.DefaultConfigProviderProps = {
    locale: default_1.default,
    prefixCls: 'arco',
    getPopupContainer: function () { return document.body; },
    size: 'default',
    renderEmpty: renderEmpty,
    focusLock: {
        modal: { autoFocus: true },
        drawer: { autoFocus: true },
    },
};
exports.ConfigContext = (0, react_1.createContext)(__assign({ getPrefixCls: function (componentName, customPrefix) {
        return (customPrefix || 'arco') + "-" + componentName;
    } }, exports.DefaultConfigProviderProps));
