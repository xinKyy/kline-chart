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
var react_dom_1 = require("react-dom");
var react_1 = __importStar(require("react"));
var react_transition_group_1 = require("react-transition-group");
var react_focus_lock_1 = __importDefault(require("react-focus-lock"));
var IconClose_1 = __importDefault(require("../../icon/react-icon-cjs/IconClose"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var dom_1 = require("../_util/dom");
var keycode_1 = require("../_util/keycode");
var Button_1 = __importDefault(require("../Button"));
var Portal_1 = __importDefault(require("../Portal"));
var confirm_1 = __importDefault(require("./confirm"));
var ConfigProvider_1 = __importStar(require("../ConfigProvider"));
var icon_hover_1 = __importDefault(require("../_class/icon-hover"));
var config_1 = require("./config");
var is_1 = require("../_util/is");
var omit_1 = __importDefault(require("../_util/omit"));
var useOverflowHidden_1 = __importDefault(require("../_util/hooks/useOverflowHidden"));
var useModal_1 = __importDefault(require("./useModal"));
var useMergeValue_1 = __importDefault(require("../_util/hooks/useMergeValue"));
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var cursorPosition = null;
var globalDialogIndex = 0;
if (!dom_1.isServerRendering) {
    document.documentElement.addEventListener('click', function (e) {
        cursorPosition = {
            left: e.clientX,
            top: e.clientY,
        };
        // 受控模式下，用户不一定马上打开弹窗，这期间可能出现其他 UI 操作，那这个位置就不可用了。
        setTimeout(function () {
            cursorPosition = null;
        }, 100);
    }, true);
}
var defaultProps = {
    mask: true,
    maskClosable: true,
    mountOnEnter: true,
    escToExit: true,
    getPopupContainer: function () { return document.body; },
    alignCenter: true,
};
function Modal(baseProps, ref) {
    var _a, _b;
    var _c;
    var context = (0, react_1.useContext)(ConfigProvider_1.ConfigContext);
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, (_c = context.componentConfig) === null || _c === void 0 ? void 0 : _c.Modal);
    var className = props.className, style = props.style, visible = props.visible, simple = props.simple, title = props.title, children = props.children, cancelText = props.cancelText, okText = props.okText, okButtonProps = props.okButtonProps, cancelButtonProps = props.cancelButtonProps, _d = props.getPopupContainer, getPopupContainer = _d === void 0 ? function () { return document.body; } : _d, footer = props.footer, afterClose = props.afterClose, confirmLoading = props.confirmLoading, mountOnEnter = props.mountOnEnter, unmountOnExit = props.unmountOnExit, afterOpen = props.afterOpen, hideCancel = props.hideCancel, autoFocus = props.autoFocus, focusLock = props.focusLock, maskClosable = props.maskClosable, mask = props.mask, alignCenter = props.alignCenter, getChildrenPopupContainer = props.getChildrenPopupContainer, wrapClassName = props.wrapClassName, escToExit = props.escToExit, modalRender = props.modalRender, maskStyle = props.maskStyle, wrapStyle = props.wrapStyle, closeIcon = props.closeIcon, rest = __rest(props, ["className", "style", "visible", "simple", "title", "children", "cancelText", "okText", "okButtonProps", "cancelButtonProps", "getPopupContainer", "footer", "afterClose", "confirmLoading", "mountOnEnter", "unmountOnExit", "afterOpen", "hideCancel", "autoFocus", "focusLock", "maskClosable", "mask", "alignCenter", "getChildrenPopupContainer", "wrapClassName", "escToExit", "modalRender", "maskStyle", "wrapStyle", "closeIcon"]);
    var modalWrapperRef = (0, react_1.useRef)(null);
    var contentWrapper = (0, react_1.useRef)(null);
    var modalRef = (0, react_1.useRef)(null);
    var _e = __read((0, react_1.useState)(), 2), wrapperVisible = _e[0], setWrapperVisible = _e[1];
    var _f = __read((0, react_1.useState)(), 2), popupZIndex = _f[0], setPopupZIndex = _f[1];
    var cursorPositionRef = (0, react_1.useRef)(null);
    var haveOriginTransformOrigin = (0, react_1.useRef)(false);
    var maskClickRef = (0, react_1.useRef)(false);
    // 标识是否是处于第一次 visible 之前
    var beforeFirstVisible = (0, react_1.useRef)(true);
    if (visible && beforeFirstVisible.current) {
        beforeFirstVisible.current = false;
    }
    var dialogIndex = (0, react_1.useRef)();
    if (!dialogIndex.current) {
        dialogIndex.current = globalDialogIndex++;
    }
    var _g = __read((0, useMergeValue_1.default)(false, {
        defaultValue: false,
        value: confirmLoading,
    }), 2), loading = _g[0], setLoading = _g[1];
    var prefixCls = context.getPrefixCls('modal', props.prefixCls);
    var locale = context.locale, rtl = context.rtl;
    // 简洁模式下默认不显示关闭按钮
    var defaultClosable = !simple;
    var closable = 'closable' in props ? props.closable : defaultClosable;
    var getContainer = (0, react_1.useCallback)(function () {
        return (0, react_dom_1.findDOMNode)(getPopupContainer());
    }, [getPopupContainer]);
    (0, useOverflowHidden_1.default)(getContainer, { hidden: visible && mask });
    var onCancel = function () {
        props.onCancel && props.onCancel();
    };
    var onEscExit = function (event) {
        if (escToExit && visible && event.key === keycode_1.Esc.key) {
            event.stopPropagation();
            onCancel();
        }
    };
    var inExit = (0, react_1.useRef)(false);
    var onClickMask = function (e) {
        if (!maskClickRef.current)
            return;
        maskClickRef.current = false;
        if (!inExit.current && maskClosable && mask && e.target === e.currentTarget) {
            setTimeout(function () {
                onCancel();
            }, 100);
        }
    };
    var onConfirmModal = function (e) {
        var onConfirm = props.onConfirm, onOk = props.onOk;
        var _onConfirm = onOk || onConfirm;
        var ret;
        if (_onConfirm) {
            ret = _onConfirm(e);
        }
        if (ret && ret.then) {
            setLoading(true);
            ret.then(function () {
                setLoading(false);
            }, function (e) {
                setLoading(false);
                console.error(e);
            });
        }
    };
    (0, react_1.useEffect)(function () {
        var timer = null;
        if (escToExit) {
            timer = setTimeout(function () {
                var _a;
                // https://github.com/arco-design/arco-design/pull/1439
                if ((0, dom_1.contains)(document.body, modalWrapperRef.current)) {
                    (_a = modalWrapperRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                }
            });
        }
        return function () {
            timer && clearTimeout(timer);
        };
    }, [visible, escToExit]);
    var initPopupZIndex = function () {
        var _a;
        if (visible && popupZIndex === undefined) {
            if (modalWrapperRef.current) {
                // 根据wrapper的zindex，设置内部所有弹出型组件的zindex。
                var zIndex = +((_a = window.getComputedStyle(modalWrapperRef.current, null)) === null || _a === void 0 ? void 0 : _a.zIndex);
                if (!isNaN(zIndex)) {
                    setPopupZIndex(zIndex + 1);
                }
            }
        }
    };
    var renderFooter = function () {
        if (footer === null)
            return;
        var cancelButtonNode = (react_1.default.createElement(Button_1.default, __assign({ onClick: onCancel }, cancelButtonProps), cancelText || locale.Modal.cancelText));
        var okButtonNode = (react_1.default.createElement(Button_1.default, __assign({ loading: loading, onClick: onConfirmModal, type: "primary" }, okButtonProps), okText || locale.Modal.okText));
        var footerContent = (0, is_1.isFunction)(footer)
            ? footer(cancelButtonNode, okButtonNode)
            : footer || (react_1.default.createElement(react_1.default.Fragment, null,
                !hideCancel && cancelButtonNode,
                okButtonNode));
        return react_1.default.createElement("div", { className: prefixCls + "-footer" }, footerContent);
    };
    var globalFocusLockConfig = context.focusLock.modal;
    var globalFocusLock = !!globalFocusLockConfig;
    var globalAutoFocus = (0, is_1.isObject)(globalFocusLockConfig) && globalFocusLockConfig.autoFocus;
    var innerFocusLock = focusLock !== undefined ? focusLock : globalFocusLock;
    var innerAutoFocus = autoFocus !== undefined ? autoFocus : globalAutoFocus;
    var element = (react_1.default.createElement(ConfigProvider_1.default, __assign({}, context, { prefixCls: props.prefixCls || context.prefixCls, locale: locale, zIndex: popupZIndex || 1050, getPopupContainer: function (node) {
            return typeof getChildrenPopupContainer === 'function'
                ? getChildrenPopupContainer(node)
                : contentWrapper.current;
        } }),
        title && (react_1.default.createElement("div", { className: prefixCls + "-header" },
            react_1.default.createElement("div", { className: prefixCls + "-title", id: "arco-dialog-" + dialogIndex.current }, title))),
        react_1.default.createElement("div", { ref: contentWrapper, className: prefixCls + "-content" }, children),
        renderFooter(),
        closable &&
            (closeIcon !== undefined ? (react_1.default.createElement("span", { onClick: onCancel, className: prefixCls + "-close-icon" }, closeIcon)) : (react_1.default.createElement(icon_hover_1.default, { tabIndex: -1, onClick: onCancel, className: prefixCls + "-close-icon", role: "button", "aria-label": "Close" },
                react_1.default.createElement(IconClose_1.default, null))))));
    var ariaProps = title ? { 'aria-labelledby': "arco-dialog-" + dialogIndex.current } : {};
    var modalDom = (react_1.default.createElement("div", __assign({ role: "dialog", "aria-modal": "true" }, ariaProps, { className: (0, classNames_1.default)(prefixCls, (_a = {},
            _a[prefixCls + "-simple"] = simple,
            _a[prefixCls + "-rtl"] = rtl,
            _a), className), style: style, ref: modalRef }), innerFocusLock ? (react_1.default.createElement(react_focus_lock_1.default, { crossFrame: false, disabled: !visible, autoFocus: innerAutoFocus, lockProps: {
            tabIndex: -1,
            onKeyDown: onEscExit,
        } }, element)) : (react_1.default.createElement(react_1.default.Fragment, null, element))));
    var setTransformOrigin = function (e) {
        if (haveOriginTransformOrigin.current)
            return;
        var transformOrigin = '';
        if (cursorPositionRef.current) {
            var eRect = e.getBoundingClientRect();
            var _a = cursorPositionRef.current, left = _a.left, top_1 = _a.top;
            transformOrigin = left - eRect.left + "px " + (top_1 - eRect.top) + "px";
        }
        e.style.transformOrigin = transformOrigin;
    };
    // mountOnEnter 只在第一次visible=true之前生效。
    // 使用 modalRef.current 而不是 mountOnExit 是因为动画结束后，modalRef.current 会变成 null，此时再去销毁dom结点，避免动画问题
    var forceRender = beforeFirstVisible.current ? !mountOnEnter : !!modalRef.current;
    return visible || forceRender ? (react_1.default.createElement(Portal_1.default, { visible: visible, forceRender: forceRender, getContainer: getPopupContainer },
        react_1.default.createElement("div", { ref: ref },
            mask ? (react_1.default.createElement(react_transition_group_1.CSSTransition, { in: visible, timeout: 400, appear: true, mountOnEnter: mountOnEnter, classNames: "fadeModal", unmountOnExit: unmountOnExit, onEnter: function (e) {
                    e.style.display = 'block';
                }, onExited: function (e) {
                    e.style.display = 'none';
                } },
                react_1.default.createElement("div", { "aria-hidden": true, className: prefixCls + "-mask", style: maskStyle }))) : null,
            react_1.default.createElement("div", __assign({}, (0, omit_1.default)(rest, [
                'content',
                'icon',
                'showIcon',
                'isNotice',
                'noticeType',
                'onCancel',
                'onOk',
                'onConfirm',
                'closable',
                'prefixCls',
            ]), { tabIndex: !innerFocusLock || !innerAutoFocus ? -1 : null, ref: function (node) {
                    modalWrapperRef.current = node;
                    initPopupZIndex();
                }, className: (0, classNames_1.default)(prefixCls + "-wrapper", (_b = {},
                    _b[prefixCls + "-wrapper-no-mask"] = !mask,
                    _b[prefixCls + "-wrapper-align-center"] = alignCenter,
                    _b[prefixCls + "-wrapper-rtl"] = rtl,
                    _b), wrapClassName), style: __assign(__assign({}, (wrapStyle || {})), { 
                    // 必须 visible=false，立即设置display:none，否则modal加载react-monaco-editor的时候，编辑器显示异常
                    display: visible || wrapperVisible ? 'block' : 'none', overflow: !visible && wrapperVisible ? 'hidden' : '' }), 
                // 如果 autoFocus 是 false 需要在 modal 外层绑定 onKeyDown, 因为此时 FocusLock 绑定的 onKeyDown 不起作用
                onKeyDown: !innerFocusLock || !innerAutoFocus ? onEscExit : null, onMouseDown: function (e) {
                    maskClickRef.current = e.target === e.currentTarget;
                }, onClick: onClickMask }),
                react_1.default.createElement(react_transition_group_1.CSSTransition, { in: visible, timeout: 400, appear: true, classNames: "zoomModal", unmountOnExit: unmountOnExit, mountOnEnter: mountOnEnter, onEnter: function (e) {
                        setWrapperVisible(true);
                        cursorPositionRef.current = cursorPosition;
                        haveOriginTransformOrigin.current = !!e.style.transformOrigin;
                        setTransformOrigin(e);
                        modalRef.current = e;
                    }, onEntered: function (e) {
                        setTransformOrigin(e);
                        cursorPositionRef.current = null;
                        afterOpen === null || afterOpen === void 0 ? void 0 : afterOpen();
                    }, onExit: function () {
                        inExit.current = true;
                    }, onExited: function (e) {
                        setWrapperVisible(false);
                        setTransformOrigin(e);
                        afterClose === null || afterClose === void 0 ? void 0 : afterClose();
                        inExit.current = false;
                        if (unmountOnExit) {
                            modalRef.current = null;
                        }
                    } }, react_1.default.cloneElement(((0, is_1.isFunction)(modalRender) ? modalRender(modalDom) : modalDom), {
                    onMouseDown: function () {
                        maskClickRef.current = false;
                    },
                    onMouseUp: function () {
                        maskClickRef.current = false;
                    },
                })))))) : null;
}
var ExportedModalComponent = (0, react_1.forwardRef)(Modal);
ExportedModalComponent.displayName = 'Modal';
ExportedModalComponent.config = config_1.setModalConfig;
ExportedModalComponent.confirm = function (props) {
    return (0, confirm_1.default)(props);
};
ExportedModalComponent.useModal = useModal_1.default;
['info', 'success', 'warning', 'error'].forEach(function (type) {
    ExportedModalComponent[type] = function (props) {
        return (0, confirm_1.default)(__assign(__assign({}, props), { isNotice: true, noticeType: type }));
    };
});
ExportedModalComponent.destroyAll = function () {
    while (config_1.destroyList.length) {
        var close_1 = config_1.destroyList.pop();
        if (close_1) {
            close_1();
        }
    }
};
exports.default = ExportedModalComponent;
