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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_transition_group_1 = require("react-transition-group");
var classNames_1 = __importDefault(require("../../_util/classNames"));
var useStateWithPromise_1 = __importDefault(require("../../_util/hooks/useStateWithPromise"));
var IconDown_1 = __importDefault(require("../../../icon/react-icon-cjs/IconDown"));
var util_1 = require("../util");
var context_1 = __importDefault(require("../context"));
var indent_1 = __importDefault(require("../indent"));
var pick_1 = __importDefault(require("../../_util/pick"));
var omit_1 = __importDefault(require("../../_util/omit"));
var keycode_1 = require("../../_util/keycode");
var useId_1 = __importDefault(require("../../_util/hooks/useId"));
// Use visibility: hidden to avoid Menu.Item get focused by Tab key
var CONTENT_HIDDEN_STYLE = { height: 0, visibility: 'hidden' };
var SubMenuInline = function (props) {
    var _a;
    var _key = props._key, children = props.children, style = props.style, className = props.className, title = props.title, level = props.level, forwardedRef = props.forwardedRef, selectable = props.selectable, rest = __rest(props, ["_key", "children", "style", "className", "title", "level", "forwardedRef", "selectable"]);
    var _b = (0, react_1.useContext)(context_1.default), menuId = _b.id, prefixCls = _b.prefixCls, levelIndent = _b.levelIndent, _c = _b.openKeys, openKeys = _c === void 0 ? [] : _c, _d = _b.selectedKeys, selectedKeys = _d === void 0 ? [] : _d, icons = _b.icons, onClickSubMenu = _b.onClickSubMenu, onClickMenuItem = _b.onClickMenuItem;
    var baseClassName = prefixCls + "-inline";
    var isOpen = (openKeys === null || openKeys === void 0 ? void 0 : openKeys.indexOf(_key)) > -1;
    var isSelected = (selectable && selectedKeys.indexOf(props._key) > -1) ||
        (0, util_1.isChildrenSelected)(children, selectedKeys);
    var _e = __read((0, useStateWithPromise_1.default)(isOpen ? { height: 'auto' } : CONTENT_HIDDEN_STYLE), 2), contentStyle = _e[0], setContentStyle = _e[1];
    var subMenuClickHandler = function (event) {
        onClickSubMenu(_key, level, 'inline');
        selectable && onClickMenuItem(_key, event);
    };
    // Unique ID of this instance
    var instanceId = (0, useId_1.default)(menuId + "-submenu-inline-");
    // Should omit these properties in Menu.Item
    var childrenList = (0, util_1.processChildren)(children, __assign(__assign({}, (0, pick_1.default)(rest, util_1.PROPS_NEED_TO_BE_PASSED_IN_SUBMENU)), { level: level + 1, selectable: selectable }));
    var header = (react_1.default.createElement("div", { tabIndex: 0, "aria-expanded": isOpen, "aria-controls": instanceId, className: (0, classNames_1.default)(baseClassName + "-header", (_a = {},
            _a[prefixCls + "-selected"] = isSelected,
            _a)), onClick: subMenuClickHandler, onKeyDown: function (event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === keycode_1.Enter.code) {
                subMenuClickHandler(event);
            }
        } },
        react_1.default.createElement(indent_1.default, { level: level, prefixCls: prefixCls, levelIndent: levelIndent }),
        react_1.default.createElement("span", null, title),
        react_1.default.createElement("span", { className: prefixCls + "-icon-suffix " + (isOpen ? 'is-open' : '') }, icons && icons.horizontalArrowDown ? icons.horizontalArrowDown : react_1.default.createElement(IconDown_1.default, null))));
    var content = (react_1.default.createElement("div", { id: instanceId, className: (0, classNames_1.default)(baseClassName + "-content"), style: contentStyle }, childrenList));
    return (react_1.default.createElement("div", __assign({ ref: forwardedRef, className: (0, classNames_1.default)(baseClassName, className), style: style }, (0, omit_1.default)(rest, ['key', 'popup', 'triggerProps'])),
        header,
        react_1.default.createElement(react_transition_group_1.CSSTransition, { in: isOpen, timeout: 200, classNames: baseClassName, unmountOnExit: false, onEnter: function (element) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setContentStyle(CONTENT_HIDDEN_STYLE)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, setContentStyle({ height: element.scrollHeight })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, onEntered: function () {
                setContentStyle({ height: 'auto' });
            }, onExit: function (element) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setContentStyle({ height: element.scrollHeight })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, setContentStyle(CONTENT_HIDDEN_STYLE)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); } }, content)));
};
exports.default = SubMenuInline;
