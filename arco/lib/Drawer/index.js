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
var react_focus_lock_1 = __importDefault(require("react-focus-lock"));
var react_dom_1 = require("react-dom");
var IconClose_1 = __importDefault(require("../../icon/react-icon-cjs/IconClose"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var Button_1 = __importDefault(require("../Button"));
var Portal_1 = __importDefault(require("../Portal"));
var ConfigProvider_1 = __importStar(require("../ConfigProvider"));
var icon_hover_1 = __importDefault(require("../_class/icon-hover"));
var is_1 = require("../_util/is");
var useOverflowHidden_1 = __importDefault(require("../_util/hooks/useOverflowHidden"));
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var omit_1 = __importDefault(require("../_util/omit"));
var keycode_1 = require("../_util/keycode");
var dom_1 = require("../_util/dom");
var defaultProps = {
    placement: 'right',
    width: 250,
    height: 250,
    escToExit: true,
    mask: true,
    closable: true,
    maskClosable: true,
    mountOnEnter: true,
    getPopupContainer: function () { return document.body; },
};
function Drawer(baseProps, ref) {
    var _a, _b, _c, _d;
    var context = (0, react_1.useContext)(ConfigProvider_1.ConfigContext);
    var locale = context.locale, getPrefixCls = context.getPrefixCls, componentConfig = context.componentConfig, rtl = context.rtl;
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Drawer);
    var style = props.style, className = props.className, children = props.children, wrapClassName = props.wrapClassName, maskStyle = props.maskStyle, headerStyle = props.headerStyle, bodyStyle = props.bodyStyle, title = props.title, footer = props.footer, okText = props.okText, cancelText = props.cancelText, width = props.width, height = props.height, placement = props.placement, mask = props.mask, visible = props.visible, closable = props.closable, maskClosable = props.maskClosable, confirmLoading = props.confirmLoading, mountOnEnter = props.mountOnEnter, unmountOnExit = props.unmountOnExit, afterOpen = props.afterOpen, afterClose = props.afterClose, getPopupContainer = props.getPopupContainer, escToExit = props.escToExit, propGetChildrenPopupContainer = props.getChildrenPopupContainer, focusLock = props.focusLock, autoFocus = props.autoFocus, okButtonProps = props.okButtonProps, cancelButtonProps = props.cancelButtonProps, zIndex = props.zIndex, closeIcon = props.closeIcon, rest = __rest(props, ["style", "className", "children", "wrapClassName", "maskStyle", "headerStyle", "bodyStyle", "title", "footer", "okText", "cancelText", "width", "height", "placement", "mask", "visible", "closable", "maskClosable", "confirmLoading", "mountOnEnter", "unmountOnExit", "afterOpen", "afterClose", "getPopupContainer", "escToExit", "getChildrenPopupContainer", "focusLock", "autoFocus", "okButtonProps", "cancelButtonProps", "zIndex", "closeIcon"]);
    var drawerWrapperRef = (0, react_1.useRef)(null);
    var contentWrapperRef = (0, react_1.useRef)(null);
    var _e = __read((0, react_1.useState)(false), 2), shouldReComputeFixed = _e[0], setShouldReComputeFixed = _e[1];
    var _f = __read((0, react_1.useState)(), 2), popupZIndex = _f[0], setPopupZIndex = _f[1];
    var prefixCls = getPrefixCls('drawer');
    // Record whether is exiting, to prevent `onCancel` being unnecessarily triggered when mask is clicked during the period.
    var _g = __read((0, react_1.useState)(false), 2), inExit = _g[0], setInExit = _g[1];
    // Record whether it's opened to avoid element shaking during animation caused by focus lock.
    var _h = __read((0, react_1.useState)(false), 2), isOpened = _h[0], setIsOpened = _h[1];
    var getContainer = (0, react_1.useCallback)(function () {
        var container = getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer();
        return ((0, react_dom_1.findDOMNode)(container) || document.body);
    }, [getPopupContainer]);
    var isFixed = (0, react_1.useMemo)(function () {
        return !dom_1.isServerRendering && getContainer() === document.body;
    }, [shouldReComputeFixed, getContainer]);
    // visible || inExit: 完全退出后在重置 overflow
    (0, useOverflowHidden_1.default)(getContainer, { hidden: (visible || inExit) && mask });
    (0, react_1.useImperativeHandle)(ref, function () { return drawerWrapperRef.current; });
    (0, react_1.useEffect)(function () {
        // 初始就是展示，且设置了 getPopupContainer 时，组件挂载后重新执行下 isFixed 的计算逻辑，避免 getPopupContainer 返回的节点还未挂载，导致 isFixed 为true，样式表现错误的问题。
        if (visible && props.getPopupContainer) {
            // Recompute `isFixed` to avoid style error resulting from truthy `isFixed` value due to the custom container dom is not mounted yet.
            setShouldReComputeFixed(true);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        if (autoFocus && visible) {
            // https://github.com/arco-design/arco-design/pull/1439
            if ((0, dom_1.contains)(document.body, drawerWrapperRef.current)) {
                (_a = drawerWrapperRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }
    }, [visible, autoFocus]);
    var initPopupZIndex = function () {
        var _a;
        if (visible && popupZIndex === undefined) {
            if (drawerWrapperRef.current) {
                // Set zIndex for nested drawer components based on zIndex of wrapper
                var zIndex_1 = +((_a = window.getComputedStyle(drawerWrapperRef.current, null)) === null || _a === void 0 ? void 0 : _a.zIndex);
                if (!isNaN(zIndex_1)) {
                    setPopupZIndex(zIndex_1 + 1);
                }
            }
        }
    };
    var element = (react_1.default.createElement("div", { className: prefixCls + "-scroll", 
        // tabIndex => https://github.com/arco-design/arco-design/issues/2121
        // use -1 => https://github.com/arco-design/arco-design/issues/2404
        tabIndex: -1 },
        title !== null && (react_1.default.createElement("div", { className: prefixCls + "-header", style: headerStyle },
            react_1.default.createElement("div", { className: prefixCls + "-header-title" }, title))),
        closable &&
            (closeIcon !== undefined ? (react_1.default.createElement("span", { onClick: props.onCancel, className: prefixCls + "-close-icon" }, closeIcon)) : (react_1.default.createElement(icon_hover_1.default, { onClick: props.onCancel, className: prefixCls + "-close-icon" },
                react_1.default.createElement(IconClose_1.default, null)))),
        react_1.default.createElement("div", { ref: function (node) {
                contentWrapperRef.current = node;
                initPopupZIndex();
            }, style: bodyStyle, className: (0, classNames_1.default)(prefixCls + "-content", (_a = {},
                _a[prefixCls + "-content-nofooter"] = footer === null,
                _a[prefixCls + "-content-noheader"] = title === null,
                _a)) },
            react_1.default.createElement(ConfigProvider_1.default, __assign({}, context, { zIndex: popupZIndex || 1050, getPopupContainer: function (node) {
                    return typeof propGetChildrenPopupContainer === 'function'
                        ? propGetChildrenPopupContainer(node)
                        : contentWrapperRef.current;
                } }), children)),
        footer !== null &&
            (footer ? (react_1.default.createElement("div", { className: prefixCls + "-footer" }, footer)) : (react_1.default.createElement("div", { className: prefixCls + "-footer" },
                react_1.default.createElement(Button_1.default, __assign({ onClick: props.onCancel }, cancelButtonProps), cancelText || locale.Drawer.cancelText),
                react_1.default.createElement(Button_1.default, __assign({ type: "primary", loading: confirmLoading, onClick: props.onOk }, okButtonProps), okText || locale.Drawer.okText))))));
    var globalFocusLockConfig = context.focusLock.drawer;
    var globalFocusLock = !!globalFocusLockConfig;
    var globalAutoFocus = (0, is_1.isObject)(globalFocusLockConfig) && globalFocusLockConfig.autoFocus;
    var innerFocusLock = focusLock !== undefined ? focusLock : globalFocusLock;
    var innerAutoFocus = autoFocus !== undefined ? autoFocus : globalAutoFocus;
    // Only enable FocusLock when drawer is fully opened, to avoid element shaking.
    var dom = innerFocusLock ? (react_1.default.createElement(react_focus_lock_1.default, { as: "span", disabled: !isOpened, crossFrame: false, autoFocus: innerAutoFocus }, element)) : (element);
    return (react_1.default.createElement(Portal_1.default, { forceRender: !mountOnEnter, visible: visible, getContainer: getPopupContainer },
        react_1.default.createElement("div", __assign({}, (0, omit_1.default)(rest, ['onCancel', 'onOk']), { ref: drawerWrapperRef, onKeyDown: function (e) {
                var _a;
                var keyCode = e.keyCode || e.which;
                if (keyCode === keycode_1.Esc.code) {
                    if (escToExit && visible) {
                        (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props, e);
                    }
                }
            }, className: (0, classNames_1.default)(prefixCls + "-wrapper", (_b = {},
                _b[prefixCls + "-no-mask"] = !mask,
                _b[prefixCls + "-wrapper-hide"] = !visible,
                _b), wrapClassName), style: isFixed
                ? { position: 'fixed', zIndex: zIndex }
                : { zIndex: zIndex || 'inherit', position: 'absolute' } }),
            mask ? (react_1.default.createElement(react_transition_group_1.CSSTransition, { in: visible, appear: true, timeout: 300, classNames: "fadeInStandard", mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit },
                react_1.default.createElement("div", { className: prefixCls + "-mask", style: maskStyle, onClick: function (e) {
                        if (!inExit && maskClosable) {
                            props.onCancel && props.onCancel(e);
                        }
                    } }))) : null,
            react_1.default.createElement(react_transition_group_1.CSSTransition, { in: visible, appear: true, timeout: 300, classNames: {
                    top: 'slideTop',
                    bottom: 'slideBottom',
                    left: 'slideLeft',
                    right: 'slideRight',
                }[placement], mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit, onEnter: function (e) {
                    e.parentNode.style.display = 'block';
                    setInExit(false);
                }, onEntered: function () {
                    setIsOpened(true);
                    afterOpen === null || afterOpen === void 0 ? void 0 : afterOpen();
                }, onExit: function () {
                    setIsOpened(false);
                    setInExit(true);
                }, onExited: function (e) {
                    setInExit(false);
                    e.parentNode.style.display = ''; // don't set display='none'
                    afterClose === null || afterClose === void 0 ? void 0 : afterClose();
                } },
                react_1.default.createElement("div", { className: (0, classNames_1.default)(prefixCls, className, (_c = {}, _c[prefixCls + "-rtl"] = rtl, _c)), style: Object.assign(placement === 'left' || placement === 'right' ? { width: width } : { height: height }, (_d = {}, _d[placement] = 0, _d), style) },
                    react_1.default.createElement("div", { className: prefixCls + "-inner" },
                        react_1.default.createElement(ConfigProvider_1.default, __assign({}, context, { zIndex: popupZIndex || 1050 }), dom)))))));
}
var DrawerComponent = react_1.default.forwardRef(Drawer);
DrawerComponent.displayName = 'Drawer';
exports.default = DrawerComponent;
