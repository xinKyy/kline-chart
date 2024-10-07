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
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { on, off, contains, getScrollElements, isScrollElement } from '../_util/dom';
import { isFunction, isObject, isArray } from '../_util/is';
import { pickDataAttributes } from '../_util/pick';
import { Esc } from '../_util/keycode';
import Portal from './portal';
import ResizeObserver from '../_util/resizeObserver';
import cs from '../_util/classNames';
import { ConfigContext } from '../ConfigProvider';
import getStyle, { getBoundingClientRect } from './getPopupStyle';
import throttleByRaf from '../_util/throttleByRaf';
import { raf, caf } from '../_util/raf';
import mergeProps from '../_util/mergeProps';
function getDOMPos(dom, options) {
    if (!dom) {
        return {};
    }
    var _a = getBoundingClientRect(dom, options), width = _a.width, height = _a.height, left = _a.left, right = _a.right;
    return {
        width: width,
        height: height,
        left: left,
        right: right,
    };
}
export var EventsByTriggerNeed = [
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onFocus',
    'onBlur',
    'onContextMenu',
    'onKeyDown',
];
function splitChildrenStyle(obj, keys) {
    var picked = {};
    var omitted = __assign({}, obj);
    keys.forEach(function (key) {
        if (obj && key in obj) {
            picked[key] = obj[key];
            delete omitted[key];
        }
    });
    return { picked: picked, omitted: omitted };
}
var defaultProps = {
    blurToHide: true,
    // clickToClose: true,
    classNames: 'fadeIn',
    trigger: 'hover',
    position: 'bottom',
    duration: 200,
    unmountOnExit: true,
    popupAlign: {},
    popupHoverStay: true,
    clickOutsideToClose: true,
    escToClose: false,
    mouseLeaveToClose: true,
    containerScrollToClose: false,
    getDocument: function () { return window.document; },
    autoFixPosition: true,
    mouseEnterDelay: 100,
    mouseLeaveDelay: 100,
    autoFitPosition: true,
};
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    function Trigger(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.delayTimer = null;
        _this.updatePositionTimer = null;
        // is popup open?
        _this.popupOpen = false;
        // if mousedown to hide popup, ignore onFocus
        _this.mousedownToHide = false;
        _this.hasPopupMouseDown = false;
        _this.unmount = false;
        _this.isDidMount = false;
        // 保存鼠标的位置
        _this.mouseLocation = {
            clientX: 0,
            clientY: 0,
        };
        // 保存当前的 mount container dom 元素
        _this.observerContainer = null;
        // 保存当前节点到 popupContainer 间的所有滚动元素
        _this.scrollElements = null;
        // container 触发 resize 时执行
        _this.resizeObserver = new ResizeObserverPolyfill(function () {
            _this.handleUpdatePosition();
        });
        _this.childrenDom = null;
        // 保存 children 节点的尺寸。主要用于在弹出层动画前和动画完成后比较尺寸是否有变化。
        _this.childrenDomSize = {};
        _this.getMergedProps = function (basePropsOrKeys) {
            var componentConfig = _this.context.componentConfig;
            var props = mergeProps(basePropsOrKeys && isObject(basePropsOrKeys) ? basePropsOrKeys : _this.props, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Trigger, basePropsOrKeys && isArray(basePropsOrKeys) ? basePropsOrKeys : undefined);
            return props;
        };
        _this.getRootElement = function () {
            _this.childrenDom = findDOMNode(_this);
            return _this.childrenDom;
        };
        _this.offScrollListeners = function () {
            (_this.scrollElements || []).forEach(function (item) {
                off(item, 'scroll', _this.handleScroll);
            });
            _this.scrollElements = null;
        };
        _this.offWindowResize = function () {
            _this.handleWindowResize = false;
            off(window, 'resize', _this.handleUpdatePosition);
        };
        _this.offContainerResize = function () {
            if (_this.resizeObserver && _this.observerContainer) {
                _this.resizeObserver.unobserve(_this.observerContainer);
                _this.observerContainer = null;
            }
        };
        _this.handleScroll = function () {
            var currentProps = _this.getMergedProps(['containerScrollToClose', 'updateOnScroll']);
            if (currentProps.containerScrollToClose) {
                _this.setPopupVisible(false);
            }
            else if (currentProps.updateOnScroll) {
                _this.handleUpdatePosition();
            }
        };
        _this.onContainersScroll = function (props) {
            var _a, _b;
            if (_this.scrollElements) {
                return;
            }
            _this.scrollElements = getScrollElements(_this.childrenDom, (_a = _this.popupContainer) === null || _a === void 0 ? void 0 : _a.parentNode);
            // 弹出层挂载载 body 且 body 不是滚动元素时，需要额外检测 document.documentElement 是否是滚动元素
            // 默认 html,body 不限制宽高时，滚动事件仅能在 window 上监听
            // fix: https://github.com/arco-design/arco-design/issues/1599
            if (props.containerScrollToClose &&
                ((_b = _this.popupContainer) === null || _b === void 0 ? void 0 : _b.parentNode) === document.body &&
                _this.scrollElements.indexOf(document.body) === -1 &&
                isScrollElement(document.documentElement)) {
                _this.scrollElements.push(window);
            }
            _this.scrollElements.forEach(function (item) {
                on(item, 'scroll', _this.handleScroll);
            });
        };
        _this.onContainerResize = function () {
            var _a;
            // containerParent 相当于是通过 getPopupContainer 传入的节点
            // 因为 this.popupContainer 会被挂载到 getPopupContainer 返回的节点上
            var containerParent = (_a = _this.popupContainer) === null || _a === void 0 ? void 0 : _a.parentNode;
            if (_this.resizeObserver && _this.observerContainer !== containerParent) {
                // 说明 containerParent 变了，取消之前的监听，监听新的 container
                _this.offContainerResize();
                containerParent && _this.resizeObserver.observe(containerParent);
                _this.observerContainer = containerParent;
            }
        };
        // getPopupContainer 改变时候触发
        _this.handleUpdatePosition = throttleByRaf(function () {
            _this.updatePopupPosition();
        });
        _this.isClickTrigger = function () {
            var trigger = _this.getMergedProps(['trigger']).trigger;
            return [].concat(trigger).indexOf('click') > -1;
        };
        _this.isFocusTrigger = function () {
            var trigger = _this.getMergedProps(['trigger']).trigger;
            return [].concat(trigger).indexOf('focus') > -1;
        };
        _this.isHoverTrigger = function () {
            var trigger = _this.getMergedProps(['trigger']).trigger;
            return [].concat(trigger).indexOf('hover') > -1;
        };
        _this.isContextMenuTrigger = function () {
            var trigger = _this.getMergedProps(['trigger']).trigger;
            return [].concat(trigger).indexOf('contextMenu') > -1;
        };
        // 是否在鼠标移出触发节点和 popup 的时候隐藏弹出层
        _this.isMouseLeaveToClose = function () {
            return _this.isHoverTrigger() && _this.getMergedProps(['mouseLeaveToClose']).mouseLeaveToClose;
        };
        // 是否在悬浮到 popup 的时候隐藏弹出层
        _this.isPopupHoverHide = function () {
            return _this.isHoverTrigger() && !_this.getMergedProps(['popupHoverStay']).popupHoverStay;
        };
        _this.isClickToHide = function () {
            if (_this.isClickTrigger() || _this.isContextMenuTrigger()) {
                var _a = _this.getMergedProps(['clickToClose']).clickToClose, clickToClose = _a === void 0 ? true : _a;
                return clickToClose;
            }
            // 2.44.0 及之前版本 clickToClose 对 hover 触发不生效。
            // 2.44.1 之后只有在 props 直接传入 clickToClose 时才生效于 hover 触发方式，避免如以下用法前后表现不一致
            // <Trigger><Trigger trigger="click"><button>sss</button></a></Trigger></Trigger>
            return _this.isHoverTrigger() && _this.props.clickToClose;
        };
        _this.isBlurToHide = function () {
            return _this.isFocusTrigger() && _this.getMergedProps(['blurToHide']).blurToHide;
        };
        _this.clearTimer = function () {
            if (_this.updatePositionTimer) {
                if (_this.updatePositionTimer.cancel) {
                    _this.updatePositionTimer.cancel();
                }
                else {
                    clearTimeout(_this.updatePositionTimer);
                    _this.updatePositionTimer = null;
                }
            }
            if (_this.delayTimer) {
                clearTimeout(_this.delayTimer);
                _this.delayTimer = null;
            }
            if (_this.mouseDownTimeout) {
                clearTimeout(_this.mouseDownTimeout);
                _this.mouseDownTimeout = null;
            }
        };
        _this.offClickOutside = function () {
            if (_this.handleClickOutside) {
                var getDocument = _this.getMergedProps(['getDocument']).getDocument;
                var root = isFunction(getDocument) && getDocument();
                off(root, 'mousedown', _this.onClickOutside);
                _this.handleClickOutside = false;
            }
        };
        _this.getTransformOrigin = function (position) {
            var _a, _b;
            var content = _this.triggerRef;
            if (!content)
                return {};
            var _c = _this.getMergedProps(['showArrow', 'classNames']), showArrow = _c.showArrow, classNames = _c.classNames;
            var top = (showArrow && ((_a = _this.arrowStyle) === null || _a === void 0 ? void 0 : _a.top)) || 0;
            var left = (showArrow && ((_b = _this.arrowStyle) === null || _b === void 0 ? void 0 : _b.left)) || 0;
            top = top ? top + "px" : '';
            left = left ? left + "px" : '';
            var transformOrigin = {
                top: (left || '50%') + " 100% 0",
                tl: (left || '15px') + " 100% 0",
                tr: (left || content.clientWidth - 15 + "px") + " 100% 0",
                bottom: (left || '50%') + " 0 0",
                bl: (left || '15px') + " 0 0",
                br: (left || content.clientWidth - 15 + "px") + " 0 0",
                left: "100% " + (top || '50%') + " 0",
                lt: "100% " + (top || '15px') + " 0",
                lb: "100% " + (top || content.clientHeight - 15 + "px") + " 0",
                right: "0 " + (top || '50%') + " 0",
                rt: "0 " + (top || '15px') + " 0",
                rb: "0 " + (top || content.clientHeight - 15 + "px") + " 0",
            };
            // tooltip popover popconfirm
            if (classNames && classNames.indexOf('zoom') > -1) {
                return {
                    transformOrigin: transformOrigin[position],
                };
            }
            if (classNames === 'slideDynamicOrigin') {
                var origin_1 = '0% 0%';
                if (['top', 'tl', 'tr'].indexOf(position) > -1) {
                    origin_1 = '100% 100%';
                }
                return {
                    transformOrigin: origin_1,
                };
            }
            return {};
        };
        // 下拉框存在初始 translateY/translateX，需要根据真实的弹出位置确定
        _this.getTransformTranslate = function () {
            if (_this.getMergedProps(['classNames']).classNames !== 'slideDynamicOrigin') {
                return '';
            }
            switch (_this.realPosition) {
                case 'bottom':
                case 'bl':
                case 'br':
                    return 'scaleY(0.9) translateY(-4px)';
                case 'top':
                case 'tl':
                case 'tr':
                    return 'scaleY(0.9) translateY(4px)';
                default:
                    return '';
            }
        };
        _this.getPopupStyle = function () {
            if (_this.unmount || !_this.popupContainer) {
                return;
            }
            var mountContainer = _this.popupContainer;
            var content = _this.triggerRef;
            var child = _this.getRootElement();
            // offsetParent=null when display:none or position: fixed
            if (!child.offsetParent && !child.getClientRects().length) {
                return _this.state.popupStyle;
            }
            var mergedProps = _this.getMergedProps();
            var _a = getStyle(mergedProps, content, child, mountContainer, _this.mouseLocation), style = _a.style, arrowStyle = _a.arrowStyle, realPosition = _a.realPosition;
            _this.realPosition = realPosition || mergedProps.position;
            _this.arrowStyle = arrowStyle || {};
            return __assign(__assign({}, style), _this.getTransformOrigin(_this.realPosition));
        };
        _this.showPopup = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            var popupStyle = _this.getPopupStyle();
            _this.setState({
                popupStyle: popupStyle,
            }, callback);
        };
        _this.update = throttleByRaf(function (callback) {
            if (_this.unmount || !_this.state.popupVisible) {
                return;
            }
            var popupStyle = _this.getPopupStyle();
            _this.setState({
                popupStyle: popupStyle,
            }, function () {
                callback === null || callback === void 0 ? void 0 : callback();
            });
        });
        _this.updatePopupPosition = function (delay, callback) {
            if (delay === void 0) { delay = 0; }
            var currentVisible = _this.state.popupVisible;
            if (!currentVisible) {
                return;
            }
            if (delay < 4) {
                _this.updatePositionTimer = _this.update(callback);
                return;
            }
            _this.updatePositionTimer = setTimeout(function () {
                var popupStyle = _this.getPopupStyle();
                _this.setState({
                    popupStyle: popupStyle,
                }, function () {
                    callback === null || callback === void 0 ? void 0 : callback();
                });
            }, delay);
        };
        _this.setPopupVisible = function (visible, delay, callback) {
            if (delay === void 0) { delay = 0; }
            var mergedProps = _this.getMergedProps(['onVisibleChange', 'popupVisible']);
            var onVisibleChange = mergedProps.onVisibleChange;
            var currentVisible = _this.state.popupVisible;
            if (visible !== currentVisible) {
                _this.delayToDo(delay, function () {
                    onVisibleChange && onVisibleChange(visible);
                    if (!('popupVisible' in mergedProps)) {
                        if (visible) {
                            _this.setState({
                                popupVisible: true,
                            }, function () {
                                _this.showPopup(callback);
                            });
                        }
                        else {
                            _this.setState({
                                popupVisible: false,
                            }, function () {
                                callback === null || callback === void 0 ? void 0 : callback();
                            });
                        }
                    }
                    else {
                        callback === null || callback === void 0 ? void 0 : callback();
                    }
                });
            }
            else {
                callback === null || callback === void 0 ? void 0 : callback();
            }
        };
        _this.delayToDo = function (delay, callback) {
            if (delay) {
                _this.clearDelayTimer();
                _this.delayTimer = setTimeout(function () {
                    callback();
                    _this.clearDelayTimer();
                }, delay);
            }
            else {
                callback();
            }
        };
        // 点击非 popup 内部，非 children 内部的节点，触发 clickoutside 逻辑
        _this.onClickOutside = function (e) {
            var _a = _this.getMergedProps([
                'onClickOutside',
                'clickOutsideToClose',
            ]), onClickOutside = _a.onClickOutside, clickOutsideToClose = _a.clickOutsideToClose;
            var triggerNode = _this.triggerRef;
            var childrenDom = _this.getRootElement();
            if (!contains(triggerNode, e.target) &&
                !contains(childrenDom, e.target) &&
                !_this.hasPopupMouseDown) {
                onClickOutside === null || onClickOutside === void 0 ? void 0 : onClickOutside();
                if (clickOutsideToClose) {
                    // 以下判断条件避免 onVisibleChange 触发两次
                    // blurToHide 为 true 时不需要执行，因为 onBlur 里会执行 setPopupVisible
                    // hover 触发方式，不执行以下逻辑。因为 mouseLeave 里会执行 setPopupVisible
                    if (!_this.isBlurToHide() && !_this.isHoverTrigger()) {
                        _this.setPopupVisible(false);
                    }
                }
            }
        };
        _this.onKeyDown = function (e) {
            var keyCode = e.keyCode || e.which;
            _this.triggerPropsEvent('onKeyDown', e);
            if (keyCode === Esc.code) {
                _this.onPressEsc(e);
            }
        };
        _this.onPressEsc = function (e) {
            var escToClose = _this.getMergedProps(['escToClose']).escToClose;
            if (escToClose && e && e.key === Esc.key && _this.state.popupVisible) {
                _this.setPopupVisible(false);
            }
        };
        _this.onMouseEnter = function (e) {
            var mouseEnterDelay = _this.getMergedProps(['mouseEnterDelay']).mouseEnterDelay;
            _this.triggerPropsEvent('onMouseEnter', e);
            _this.clearDelayTimer();
            _this.setPopupVisible(true, mouseEnterDelay || 0);
        };
        _this.onMouseMove = function (e) {
            _this.triggerPropsEvent('onMouseMove', e);
            _this.setMouseLocation(e);
            if (_this.state.popupVisible) {
                _this.update();
            }
        };
        _this.onMouseLeave = function (e) {
            var mouseLeaveDelay = _this.getMergedProps(['mouseLeaveDelay']).mouseLeaveDelay;
            _this.clearDelayTimer();
            _this.triggerPropsEvent('onMouseLeave', e);
            if (_this.isMouseLeaveToClose()) {
                if (_this.state.popupVisible) {
                    _this.setPopupVisible(false, mouseLeaveDelay || 0);
                }
            }
        };
        _this.onPopupMouseEnter = function () {
            _this.clearDelayTimer();
        };
        _this.onPopupMouseLeave = function (e) {
            _this.onMouseLeave(e);
        };
        _this.setMouseLocation = function (e) {
            if (_this.getMergedProps(['alignPoint']).alignPoint) {
                _this.mouseLocation = {
                    clientX: e.clientX,
                    clientY: e.clientY,
                };
            }
        };
        _this.onContextMenu = function (e) {
            e.preventDefault();
            _this.triggerPropsEvent('onContextMenu', e);
            _this.setMouseLocation(e);
            if (!_this.state.popupVisible) {
                _this.setPopupVisible(true, 0);
            }
            else {
                // 更新位置
                _this.getMergedProps(['alignPoint']).alignPoint && _this.update();
            }
        };
        _this.clickToHidePopup = function (e) {
            var popupVisible = _this.state.popupVisible;
            if (popupVisible) {
                _this.mousedownToHide = true;
            }
            _this.triggerPropsEvent('onClick', e);
            if (_this.isClickToHide() && popupVisible) {
                _this.setPopupVisible(!popupVisible, 0);
            }
        };
        _this.onClick = function (e) {
            var popupVisible = _this.state.popupVisible;
            if (popupVisible) {
                _this.mousedownToHide = true;
            }
            _this.triggerPropsEvent('onClick', e);
            _this.setMouseLocation(e);
            if (!_this.isClickToHide() && popupVisible) {
                return;
            }
            _this.setPopupVisible(!popupVisible, 0);
        };
        _this.onFocus = function (e) {
            var focusDelay = _this.getMergedProps(['focusDelay']).focusDelay;
            var onFocus = function () {
                _this.triggerPropsEvent('onFocus', e);
            };
            _this.clearDelayTimer();
            if (!_this.mousedownToHide) {
                if (_this.state.popupVisible) {
                    onFocus === null || onFocus === void 0 ? void 0 : onFocus();
                }
                else {
                    _this.setPopupVisible(true, focusDelay || 0, onFocus);
                }
            }
            _this.mousedownToHide = false;
        };
        _this.onBlur = function (e) {
            _this.setPopupVisible(false, 200, function () { return _this.triggerPropsEvent('onBlur', e); });
        };
        _this.onResize = function () {
            if (_this.getMergedProps(['autoFixPosition']).autoFixPosition && _this.state.popupVisible) {
                _this.updatePopupPosition();
            }
        };
        _this.onPopupMouseDown = function () {
            _this.hasPopupMouseDown = true;
            clearTimeout(_this.mouseDownTimeout);
            _this.mouseDownTimeout = setTimeout(function () {
                _this.hasPopupMouseDown = false;
            }, 0);
        };
        // 当 children 中的元素 disabled 时，不能正确触发 hover 等事件，所以当监测到对应
        // 组件有 disabled 时，给元素加一层 span，处理事件，模拟样式
        _this.getChild = function () {
            var _a;
            var children = _this.props.children;
            var element = children;
            var elementType = (element && typeof element !== 'string' && element.type);
            var child = children;
            if (['string', 'number'].indexOf(typeof children) > -1 || React.Children.count(children) > 1) {
                child = React.createElement("span", null, children);
            }
            else if (element &&
                elementType &&
                (elementType.__BYTE_BUTTON === true ||
                    elementType.__BYTE_CHECKBOX === true ||
                    elementType.__BYTE_SWITCH === true ||
                    elementType.__BYTE_RADIO === true ||
                    elementType === 'button') &&
                element.props.disabled) {
                // 从样式中提取出会影响布局的到上层 span 样式中。
                var _b = splitChildrenStyle(element.props.style, [
                    'position',
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'float',
                    'display',
                    'zIndex',
                ]), picked = _b.picked, omitted = _b.omitted;
                child = (React.createElement("span", { className: (_a = element.props) === null || _a === void 0 ? void 0 : _a.className, style: __assign(__assign({ display: 'inline-block' }, picked), { cursor: 'not-allowed' }) }, React.cloneElement(element, {
                    style: __assign(__assign({}, omitted), { pointerEvents: 'none' }),
                    className: undefined,
                })));
            }
            // 防止为空报错
            return child || React.createElement("span", null);
        };
        // 创建的 dom 节点插入 getPopupContainer。
        _this.appendToContainer = function (node) {
            caf(_this.rafId);
            if (_this.isDidMount) {
                var getGlobalPopupContainer = _this.context.getPopupContainer;
                var getPopupContainer = _this.getMergedProps(['getPopupContainer']).getPopupContainer;
                var gpc = getPopupContainer || getGlobalPopupContainer;
                var rootElement = _this.getRootElement();
                var parent_1 = gpc(rootElement);
                if (parent_1) {
                    parent_1.appendChild(node);
                    return;
                }
            }
            _this.rafId = raf(function () {
                _this.appendToContainer(node);
            });
        };
        _this.getContainer = function () {
            var popupContainer = document.createElement('div');
            popupContainer.style.width = '100%';
            popupContainer.style.position = 'absolute';
            popupContainer.style.top = '0';
            popupContainer.style.left = '0';
            _this.popupContainer = popupContainer;
            _this.appendToContainer(popupContainer);
            return popupContainer;
        };
        // 1. 触发直接附加到 Trigger 上的事件，大多是 Trigger 直接嵌套 Trigger 的情况
        // 2. 触发 children 上直接被附加的事件
        _this.triggerPropsEvent = function (eventName, e) {
            var child = _this.getChild();
            var childHandler = child && child.props && child.props[eventName];
            var handlerFn = _this.getMergedProps([eventName])[eventName];
            if (isFunction(childHandler)) {
                childHandler(e);
            }
            if (isFunction(handlerFn)) {
                handlerFn(e);
            }
        };
        // 触发 children/ trigger 组件上被附加的事件
        _this.triggerOriginEvent = function (eventName) {
            var child = _this.getChild();
            var childHandler = child && child.props && child.props[eventName];
            var propsHandler = _this.getMergedProps([eventName])[eventName];
            if (isFunction(propsHandler) && isFunction(childHandler)) {
                return function (e) {
                    childHandler(e);
                    propsHandler(e);
                };
            }
            return childHandler || propsHandler;
        };
        var mergedProps = _this.getMergedProps(props);
        var popupVisible = 'popupVisible' in mergedProps ? mergedProps.popupVisible : mergedProps.defaultPopupVisible;
        _this.popupOpen = !!popupVisible;
        _this.state = {
            popupVisible: !!popupVisible,
            popupStyle: {},
        };
        return _this;
    }
    Trigger.getDerivedStateFromProps = function (nextProps, state) {
        if ('popupVisible' in nextProps && nextProps.popupVisible !== state.popupVisible) {
            return {
                popupVisible: nextProps.popupVisible,
            };
        }
        return null;
    };
    Trigger.prototype.componentDidMount = function () {
        this.componentDidUpdate(this.getMergedProps());
        this.isDidMount = true;
        this.unmount = false;
        this.childrenDom = this.getRootElement();
        if (this.state.popupVisible) {
            this.childrenDomSize = getDOMPos(this.childrenDom, {
                boundaryDistance: this.props.alignPoint ? undefined : this.props.boundaryDistance,
                position: this.props.position,
            });
        }
    };
    Trigger.prototype.componentDidUpdate = function (_prevProps) {
        var prevProps = this.getMergedProps(_prevProps);
        var currentProps = this.getMergedProps();
        if (!prevProps.popupVisible && currentProps.popupVisible) {
            this.update();
        }
        var popupVisible = this.state.popupVisible;
        this.popupOpen = popupVisible;
        var getDocument = currentProps.getDocument;
        if (!popupVisible) {
            this.offClickOutside();
            this.offContainerResize();
            this.offWindowResize();
            this.offScrollListeners();
            return;
        }
        var rect = getDOMPos(this.childrenDom, {
            boundaryDistance: this.props.alignPoint ? {} : this.props.boundaryDistance,
            position: this.props.position,
        });
        // children 节点的尺寸改变，主要是处理 children 存在 scale 等动画属性，或者移动位置的时候，popup 的位置有问题
        if (JSON.stringify(rect) !== JSON.stringify(this.childrenDomSize)) {
            this.updatePopupPosition();
            this.childrenDomSize = rect;
        }
        // popupVisible 为 true
        this.onContainerResize();
        if (currentProps.updateOnScroll || currentProps.containerScrollToClose) {
            this.onContainersScroll(currentProps);
        }
        if (!this.handleWindowResize) {
            on(window, 'resize', this.handleUpdatePosition);
            this.handleWindowResize = true;
        }
        if (!this.handleClickOutside) {
            var root = isFunction(getDocument) && getDocument();
            if (root) {
                // clickOutside 必须监听 mousedown。
                // 1. 如果事件目标元素在 click 后被移除，document.onclick 被触发时已经没有该元素，会错误触发 clickOutside 逻辑，隐藏 popup。
                // 2. 点击 label 标签，会触发对应 input 元素的点击事件，导致触发 clickOutside，隐藏 popup。
                on(root, 'mousedown', this.onClickOutside, {
                    capture: isObject(currentProps.clickOutsideToClose)
                        ? currentProps.clickOutsideToClose.capture
                        : false,
                });
                this.handleClickOutside = true;
            }
        }
    };
    Trigger.prototype.componentWillUnmount = function () {
        this.unmount = true;
        this.offClickOutside();
        this.clearTimer();
        this.offWindowResize();
        this.offScrollListeners();
        this.offContainerResize();
        caf(this.rafId);
    };
    Trigger.prototype.clearDelayTimer = function () {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    };
    Trigger.prototype.render = function () {
        var _a, _b, _c;
        var _this = this;
        var _d;
        var _e = this.getMergedProps(), children = _e.children, style = _e.style, className = _e.className, arrowProps = _e.arrowProps, disabled = _e.disabled, popup = _e.popup, classNames = _e.classNames, duration = _e.duration, unmountOnExit = _e.unmountOnExit, alignPoint = _e.alignPoint, autoAlignPopupWidth = _e.autoAlignPopupWidth, position = _e.position, childrenPrefix = _e.childrenPrefix, showArrow = _e.showArrow, dropdownPopupStyle = _e.popupStyle, __onExit = _e.__onExit, __onExited = _e.__onExited;
        var isExistChildren = children || children === 0;
        var _f = this.context, getPrefixCls = _f.getPrefixCls, zIndex = _f.zIndex, rtl = _f.rtl;
        var _g = this.state, popupVisible = _g.popupVisible, popupStyle = _g.popupStyle;
        if (!popup) {
            return null;
        }
        var mergeProps = {};
        var popupEventProps = {
            onMouseDown: this.onPopupMouseDown,
        };
        if (this.isHoverTrigger() && !disabled) {
            mergeProps.onMouseEnter = this.onMouseEnter;
            mergeProps.onMouseLeave = this.onMouseLeave;
            // https://github.com/arco-design/arco-design/issues/1804
            // TODO: remove login in next major version
            if (this.isClickToHide()) {
                mergeProps.onClick = this.clickToHidePopup;
            }
            if (alignPoint) {
                mergeProps.onMouseMove = this.onMouseMove;
            }
            if (!this.isPopupHoverHide()) {
                popupEventProps.onMouseEnter = this.onPopupMouseEnter;
                popupEventProps.onMouseLeave = this.onPopupMouseLeave;
            }
        }
        else {
            mergeProps.onMouseEnter = this.triggerOriginEvent('onMouseEnter');
            mergeProps.onMouseLeave = this.triggerOriginEvent('onMouseLeave');
        }
        if (this.isContextMenuTrigger() && !disabled) {
            mergeProps.onContextMenu = this.onContextMenu;
            mergeProps.onClick = this.clickToHidePopup;
        }
        else {
            mergeProps.onContextMenu = this.triggerOriginEvent('onContextMenu');
        }
        if (this.isClickTrigger() && !disabled) {
            mergeProps.onClick = this.onClick;
        }
        else {
            mergeProps.onClick = mergeProps.onClick || this.triggerOriginEvent('onClick');
        }
        if (this.isFocusTrigger() && !disabled) {
            mergeProps.onFocus = this.onFocus;
            if (this.isBlurToHide()) {
                mergeProps.onBlur = this.onBlur;
            }
        }
        else {
            mergeProps.onFocus = this.triggerOriginEvent('onFocus');
            mergeProps.onBlur = this.triggerOriginEvent('onBlur');
        }
        if (!disabled) {
            mergeProps.onKeyDown = this.onKeyDown;
        }
        else {
            mergeProps.onKeyDown = this.triggerOriginEvent('onKeyDown');
        }
        var child = this.getChild();
        var popupChildren = React.Children.only(popup());
        if (child.props.className) {
            mergeProps.className = child.props.className;
        }
        if (childrenPrefix && popupVisible) {
            mergeProps.className = mergeProps.className
                ? mergeProps.className + " " + childrenPrefix + "-open"
                : childrenPrefix + "-open";
        }
        // 只有在 focus 触发时，设置 tabIndex，点击 tab 键，能触发 focus 事件，展示弹出框
        if (this.isFocusTrigger()) {
            mergeProps.tabIndex = disabled ? -1 : 0;
        }
        var prefixCls = getPrefixCls('trigger');
        var popupClassName = cs(prefixCls, childrenPrefix, prefixCls + "-position-" + position, (_a = {}, _a[prefixCls + "-rtl"] = rtl, _a), className);
        var childrenComponent = isExistChildren && (React.createElement(ResizeObserver, { onResize: this.onResize }, React.cloneElement(child, __assign({}, mergeProps))));
        var portalContent = (React.createElement(CSSTransition, { in: !!popupVisible, timeout: duration, classNames: classNames, unmountOnExit: unmountOnExit, appear: true, mountOnEnter: true, onEnter: function (e) {
                e.style.display = 'initial';
                e.style.pointerEvents = 'none';
                if (classNames === 'slideDynamicOrigin') {
                    // 下拉菜单
                    e.style.transform = _this.getTransformTranslate();
                }
            }, onEntering: function (e) {
                if (classNames === 'slideDynamicOrigin') {
                    // 下拉菜单
                    e.style.transform = '';
                }
            }, onEntered: function (e) {
                e.style.pointerEvents = 'auto';
                _this.forceUpdate();
            }, onExit: function (e) {
                // 避免消失动画时对元素的快速点击触发意外的操作
                e.style.pointerEvents = 'none';
                __onExit === null || __onExit === void 0 ? void 0 : __onExit(e);
            }, onExited: function (e) {
                e.style.display = 'none';
                // 这里立即设置为 null 是为了在 setState popupStyle 引起重新渲染时，能触发 Portal 的卸载事件。移除父节点。
                // 否则只有在下个循环中 triggerRef 才会变为 null，需要重新 forceUpdate，才能触发 Portal 的 unmount。
                if (unmountOnExit) {
                    _this.triggerRef = null;
                }
                _this.setState({ popupStyle: {} });
                __onExited === null || __onExited === void 0 ? void 0 : __onExited(e);
            } },
            React.createElement(ResizeObserver, { onResize: function () {
                    var target = _this.triggerRef;
                    if (target) {
                        // Avoid the flickering problem caused by the size change and positioning not being recalculated in time.
                        // TODO: Consider changing the popup style directly  in the next major version
                        var popupStyle_1 = _this.getPopupStyle();
                        var style_1 = _this.props.style || {};
                        target.style.top = String(style_1.top || popupStyle_1.top + "px");
                        target.style.left = String(style_1.left || popupStyle_1.left + "px");
                    }
                    _this.onResize();
                } },
                React.createElement("span", __assign({ ref: function (node) { return (_this.triggerRef = node); }, "trigger-placement": this.realPosition, style: __assign(__assign(__assign({ width: autoAlignPopupWidth && (style === null || style === void 0 ? void 0 : style.width) === undefined
                            ? (_d = this.childrenDomSize) === null || _d === void 0 ? void 0 : _d.width
                            : '' }, popupStyle), { position: 'absolute', zIndex: zIndex || '' }), style) }, popupEventProps, { className: popupClassName }, pickDataAttributes(this.props)),
                    React.createElement(popupChildren.type, __assign({ ref: popupChildren.ref }, popupChildren.props, { style: __assign(__assign({}, popupChildren.props.style), dropdownPopupStyle) })),
                    (showArrow || arrowProps) && (React.createElement("div", { className: cs(prefixCls + "-arrow-container", (_b = {},
                            _b[childrenPrefix + "-arrow-container"] = childrenPrefix,
                            _b)) },
                        React.createElement("div", __assign({}, arrowProps, { className: cs(prefixCls + "-arrow", (_c = {},
                                _c[childrenPrefix + "-arrow"] = childrenPrefix,
                                _c), arrowProps === null || arrowProps === void 0 ? void 0 : arrowProps.className), style: __assign(__assign({}, this.arrowStyle), arrowProps === null || arrowProps === void 0 ? void 0 : arrowProps.style) }))))))));
        // 如果 triggerRef 不存在，说明弹出层内容被销毁，可以隐藏 portal。
        var portal = popupVisible || this.triggerRef ? (React.createElement(Portal, { getContainer: this.getContainer }, portalContent)) : null;
        return isExistChildren ? (React.createElement(React.Fragment, null,
            childrenComponent,
            portal)) : (portal);
    };
    Trigger.displayName = 'Trigger';
    Trigger.contextType = ConfigContext;
    return Trigger;
}(PureComponent));
export default Trigger;
