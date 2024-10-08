"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var react_1 = __importStar(require("react"));
var IconClose_1 = __importDefault(require("../../icon/react-icon-cjs/IconClose"));
var IconCheckCircleFill_1 = __importDefault(require("../../icon/react-icon-cjs/IconCheckCircleFill"));
var IconCloseCircleFill_1 = __importDefault(require("../../icon/react-icon-cjs/IconCloseCircleFill"));
var IconInfoCircleFill_1 = __importDefault(require("../../icon/react-icon-cjs/IconInfoCircleFill"));
var IconExclamationCircleFill_1 = __importDefault(require("../../icon/react-icon-cjs/IconExclamationCircleFill"));
var IconLoading_1 = __importDefault(require("../../icon/react-icon-cjs/IconLoading"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var icon_hover_1 = __importDefault(require("../_class/icon-hover"));
var context_1 = require("../../icon/react-icon-cjs/context");
var ConfigProvider_1 = __importDefault(require("../ConfigProvider"));
var context_2 = require("../ConfigProvider/context");
var Notice = /** @class */ (function (_super) {
    __extends(Notice, _super);
    function Notice() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startTimer = function () {
            var _a = _this.props, duration = _a.duration, onClose = _a.onClose, id = _a.id;
            // 自动关闭
            if (duration !== 0) {
                _this.timer = window.setTimeout(function () {
                    onClose && onClose(id);
                    _this.removeTimer();
                }, duration);
            }
        };
        _this.removeTimer = function () {
            if (_this.timer) {
                window.clearTimeout(_this.timer);
                _this.timer = null;
            }
        };
        _this.onClose = function () {
            _this.props.onClose && _this.props.onClose(_this.props.id);
        };
        _this.renderIcon = function () {
            var _a = _this.props, showIcon = _a.showIcon, icon = _a.icon, type = _a.type, prefixCls = _a.prefixCls, iconPrefix = _a.iconPrefix;
            var content;
            if (icon) {
                content = icon;
            }
            else if (showIcon) {
                switch (type) {
                    case 'info':
                        content = react_1.default.createElement(IconInfoCircleFill_1.default, null);
                        break;
                    case 'success':
                        content = react_1.default.createElement(IconCheckCircleFill_1.default, null);
                        break;
                    case 'error':
                        content = react_1.default.createElement(IconCloseCircleFill_1.default, null);
                        break;
                    case 'warning':
                        content = react_1.default.createElement(IconExclamationCircleFill_1.default, null);
                        break;
                    case 'loading':
                        content = react_1.default.createElement(IconLoading_1.default, null);
                        break;
                    default:
                        break;
                }
                content = (react_1.default.createElement(context_1.IconContext.Provider, { value: iconPrefix ? { prefixCls: iconPrefix } : {} }, content));
            }
            return react_1.default.createElement("span", { className: prefixCls + "-icon" }, content);
        };
        _this.onMouseEnter = function () {
            _this.removeTimer();
        };
        _this.onMouseLeave = function () {
            // An update operation may be triggered after mouseEnter to start a new timer.
            // mouseEnter(clear) => clickBtn => update(new timer) => mouseLeave
            _this.removeTimer();
            _this.startTimer();
        };
        return _this;
    }
    Notice.prototype.componentDidMount = function () {
        this.startTimer();
    };
    Notice.prototype.componentDidUpdate = function (nextProps) {
        if (nextProps.duration !== this.props.duration || this.props.update) {
            this.removeTimer();
            this.startTimer();
        }
    };
    Notice.prototype.componentWillUnmount = function () {
        this.removeTimer();
    };
    Notice.prototype.render = function () {
        var _a;
        var _b = this.props, title = _b.title, content = _b.content, showIcon = _b.showIcon, className = _b.className, style = _b.style, type = _b.type, btn = _b.btn, icon = _b.icon, prefixCls = _b.prefixCls, closable = _b.closable, noticeType = _b.noticeType, iconPrefix = _b.iconPrefix, rtl = _b.rtl, closeIcon = _b.closeIcon, classPrefixCls = _b.classPrefixCls;
        var classNames = (0, classNames_1.default)(prefixCls, prefixCls + "-" + type, (_a = {},
            _a[prefixCls + "-closable"] = closable,
            _a[prefixCls + "-rtl"] = rtl,
            _a), className);
        var _closable = 'closable' in this.props ? closable : true;
        var shouldRenderIcon = showIcon;
        if (type === 'normal' && !icon) {
            shouldRenderIcon = false;
        }
        var configContext = __assign({}, this.context);
        if (classPrefixCls) {
            configContext.prefixCls = classPrefixCls;
        }
        if (noticeType === 'message') {
            _closable = closable;
            return (react_1.default.createElement(ConfigProvider_1.default, __assign({}, configContext),
                react_1.default.createElement("div", { style: { textAlign: 'center' }, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
                    react_1.default.createElement("div", { className: classNames, style: style, role: "alert" },
                        shouldRenderIcon && this.renderIcon(),
                        react_1.default.createElement("span", { className: prefixCls + "-content" }, content),
                        _closable &&
                            (closeIcon !== undefined ? (react_1.default.createElement("span", { onClick: this.onClose, className: prefixCls + "-close-btn" }, closeIcon)) : (react_1.default.createElement(icon_hover_1.default, { prefix: prefixCls, className: prefixCls + "-close-btn", onClick: this.onClose },
                                react_1.default.createElement(IconClose_1.default, null))))))));
        }
        if (noticeType === 'notification') {
            return (react_1.default.createElement(ConfigProvider_1.default, __assign({}, configContext),
                react_1.default.createElement("div", { onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
                    react_1.default.createElement("div", { className: classNames, style: style, role: "alert" },
                        shouldRenderIcon && react_1.default.createElement("div", { className: prefixCls + "-left" }, this.renderIcon()),
                        react_1.default.createElement("div", { className: prefixCls + "-right" },
                            title && react_1.default.createElement("div", { className: prefixCls + "-title" }, title),
                            react_1.default.createElement("div", { className: prefixCls + "-content" }, content),
                            btn && react_1.default.createElement("div", { className: prefixCls + "-btn-wrapper" }, btn)),
                        _closable &&
                            (closeIcon !== undefined ? (react_1.default.createElement("span", { onClick: this.onClose, className: prefixCls + "-close-btn" }, closeIcon)) : (react_1.default.createElement(icon_hover_1.default, { prefix: prefixCls, className: prefixCls + "-close-btn", onClick: this.onClose },
                                react_1.default.createElement(context_1.IconContext.Provider, { value: iconPrefix ? { prefixCls: iconPrefix } : {} },
                                    react_1.default.createElement(IconClose_1.default, null)))))))));
        }
    };
    Notice.defaultProps = {
        type: 'info',
        showIcon: true,
        noticeType: 'message',
        duration: 3000,
    };
    Notice.contextType = context_2.ConfigContext;
    return Notice;
}(react_1.Component));
exports.default = Notice;
