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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
var throttle_1 = __importDefault(require("lodash/throttle"));
var react_dom_1 = require("react-dom");
var ResizeObserverComponent = /** @class */ (function (_super) {
    __extends(ResizeObserverComponent, _super);
    function ResizeObserverComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.componentWillUnmount = function () {
            if (_this.resizeObserver) {
                _this.destroyResizeObserver();
            }
        };
        _this.createResizeObserver = function () {
            var _a = _this.props.throttle, throttle = _a === void 0 ? true : _a;
            var onResize = function (entry) {
                var _a, _b;
                (_b = (_a = _this.props).onResize) === null || _b === void 0 ? void 0 : _b.call(_a, entry);
            };
            var resizeHandler = throttle ? (0, throttle_1.default)(onResize) : onResize;
            var firstExec = true; // 首次监听时，立即执行一次 onResize，之前行为保持一致，避免布局类组件出现闪动的情况
            _this.resizeObserver = new resize_observer_polyfill_1.default(function (entry) {
                if (firstExec) {
                    firstExec = false;
                    onResize(entry);
                }
                resizeHandler(entry);
            });
            _this.resizeObserver.observe((0, react_dom_1.findDOMNode)(_this));
        };
        _this.destroyResizeObserver = function () {
            _this.resizeObserver && _this.resizeObserver.disconnect();
            _this.resizeObserver = null;
        };
        return _this;
    }
    ResizeObserverComponent.prototype.componentDidMount = function () {
        if (!react_1.default.isValidElement(this.props.children)) {
            console.warn('The children of ResizeObserver is invalid.');
        }
        else {
            this.createResizeObserver();
        }
    };
    ResizeObserverComponent.prototype.componentDidUpdate = function () {
        if (!this.resizeObserver && (0, react_dom_1.findDOMNode)(this)) {
            this.createResizeObserver();
        }
    };
    ResizeObserverComponent.prototype.render = function () {
        return this.props.children;
    };
    return ResizeObserverComponent;
}(react_1.default.Component));
exports.default = ResizeObserverComponent;
