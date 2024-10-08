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
var omit_1 = __importDefault(require("../_util/omit"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var ConfigProvider_1 = require("../ConfigProvider");
var dom_1 = require("../_util/dom");
var resize_trigger_1 = __importDefault(require("./resize-trigger"));
var split_1 = __importDefault(require("./split"));
var useMergeValue_1 = __importDefault(require("../_util/hooks/useMergeValue"));
var is_1 = require("../_util/is");
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var split_group_1 = __importDefault(require("./split-group"));
var DIRECTION_LEFT = 'left';
var DIRECTION_RIGHT = 'right';
var DIRECTION_TOP = 'top';
var DIRECTION_BOTTOM = 'bottom';
var allDirections = [
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_TOP,
    DIRECTION_BOTTOM,
];
var defaultProps = {
    component: 'div',
    directions: ['right'],
    resizeIcons: {},
    resizeTriggers: {},
};
var getOppositeDirection = function (direction) {
    switch (direction) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return direction;
    }
};
function ResizeBox(baseProps, ref) {
    var _a;
    var _b = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _b.getPrefixCls, componentConfig = _b.componentConfig, rtl = _b.rtl;
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.ResizeBox);
    var style = props.style, className = props.className, component = props.component, directions = props.directions, resizeIcons = props.resizeIcons, children = props.children, resizeTriggers = props.resizeTriggers, propWidth = props.width, propHeight = props.height, rest = __rest(props, ["style", "className", "component", "directions", "resizeIcons", "children", "resizeTriggers", "width", "height"]);
    var realDirections = rtl ? directions.map(function (dir) { return getOppositeDirection(dir); }) : directions;
    var prefixCls = getPrefixCls('resizebox');
    var classNames = (0, classNames_1.default)(prefixCls, (_a = {}, _a[prefixCls + "-rtl"] = rtl, _a), className);
    var _c = __read((0, react_1.useState)({}), 2), paddingStyles = _c[0], setPaddingStyles = _c[1];
    var _d = __read((0, useMergeValue_1.default)(undefined, { value: propWidth }), 2), width = _d[0], setWidth = _d[1];
    var _e = __read((0, useMergeValue_1.default)(undefined, { value: propHeight }), 2), height = _e[0], setHeight = _e[1];
    var recordRef = (0, react_1.useRef)({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        direction: DIRECTION_RIGHT,
        moving: false,
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
    var wrapperRef = (0, react_1.useRef)();
    (0, react_1.useImperativeHandle)(ref, function () { return wrapperRef.current; }, []);
    function getIsHorizontal(direction) {
        return [DIRECTION_TOP, DIRECTION_BOTTOM].indexOf(direction) > -1;
    }
    function getRealSize(clientSize, padding) {
        if (clientSize === 0)
            return 0;
        var res = clientSize - padding;
        return res <= 0 ? 0 : res;
    }
    //
    function setOrResetBodyCursor(cursor) {
        var attrKey = 'data-arco-origin-cursor';
        if (cursor) {
            // 因为只会覆盖内联样式的 cursor，所以只需要记录下原本内联的 cursor 值即可。
            document.body.setAttribute(attrKey, document.body.style.cursor);
            document.body.style.cursor = cursor;
        }
        else {
            // reset to origin cursor
            var originCursor = document.body.getAttribute(attrKey);
            document.body.style.cursor = originCursor || '';
            document.body.removeAttribute(attrKey);
        }
    }
    function onTriggerMouseDown(direction, e) {
        var _a, _b;
        props.onMovingStart && props.onMovingStart();
        recordRef.current.moving = true;
        recordRef.current.startX = e.pageX;
        recordRef.current.startY = e.pageY;
        recordRef.current.direction = direction;
        // 因为 clientWidth 拿到的尺寸包含 padding，而 padding 不应该成为 width 计算的一部分，所以需要去掉。
        var _c = recordRef.current.padding, top = _c.top, left = _c.left, right = _c.right, bottom = _c.bottom;
        recordRef.current.startWidth = getRealSize((_a = wrapperRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth, left + right);
        recordRef.current.startHeight = getRealSize((_b = wrapperRef.current) === null || _b === void 0 ? void 0 : _b.clientHeight, top + bottom);
        (0, dom_1.on)(window, 'mousemove', moving);
        (0, dom_1.on)(window, 'touchmove', moving);
        (0, dom_1.on)(window, 'mouseup', moveEnd);
        (0, dom_1.on)(window, 'touchend', moveEnd);
        (0, dom_1.on)(window, 'contextmenu', moveEnd);
        setOrResetBodyCursor(getIsHorizontal(direction) ? 'row-resize' : 'col-resize');
    }
    function moving(e) {
        if (!recordRef.current.moving)
            return false;
        var _a = recordRef.current, startX = _a.startX, startY = _a.startY, startWidth = _a.startWidth, startHeight = _a.startHeight;
        var newWidth = startWidth;
        var newHeight = startHeight;
        // 往右移动的距离
        var offsetX = e.pageX - startX;
        // 往下移动的距离
        var offsetY = e.pageY - startY;
        switch (recordRef.current.direction) {
            case DIRECTION_LEFT:
                newWidth = startWidth - offsetX;
                setWidth(newWidth);
                break;
            case DIRECTION_RIGHT:
                newWidth = startWidth + offsetX;
                setWidth(newWidth);
                break;
            case DIRECTION_TOP:
                newHeight = startHeight - offsetY;
                setHeight(newHeight);
                break;
            case DIRECTION_BOTTOM:
                newHeight = startHeight + offsetY;
                setHeight(newHeight);
                break;
            default:
                break;
        }
        props.onMoving &&
            props.onMoving(e, {
                width: newWidth,
                height: newHeight,
            });
    }
    function moveEnd() {
        recordRef.current.moving = false;
        offEvents();
        setOrResetBodyCursor();
        props.onMovingEnd && props.onMovingEnd();
    }
    function offEvents() {
        (0, dom_1.off)(window, 'mousemove', moving);
        (0, dom_1.off)(window, 'touchmove', moving);
        (0, dom_1.off)(window, 'mouseup', moveEnd);
        (0, dom_1.off)(window, 'touchend', moveEnd);
        (0, dom_1.off)(window, 'contextmenu', moveEnd);
    }
    function onTriggerResize(direction, e) {
        var isHorizontal = getIsHorizontal(direction);
        var contentRect = e[0].contentRect;
        var styleDirection = "" + direction.slice(0, 1).toUpperCase() + direction.slice(1);
        var size = contentRect[isHorizontal ? 'height' : 'width'];
        // 记录 padding，用于计算 width
        recordRef.current.padding[direction] = size;
        setPaddingStyles(function (pre) {
            var _a;
            return (__assign(__assign({}, pre), (_a = {}, _a["padding" + styleDirection] = size, _a)));
        });
    }
    var wrapperStyles = __assign(__assign(__assign(__assign({}, paddingStyles), (style || {})), ((0, is_1.isNumber)(width) ? { width: width } : {})), ((0, is_1.isNumber)(height) ? { height: height } : {}));
    var Tag = component;
    return (react_1.default.createElement(Tag, __assign({}, (0, omit_1.default)(rest, ['onMovingStart', 'onMoving', 'onMovingEnd']), { style: wrapperStyles, className: classNames, ref: wrapperRef }),
        children,
        realDirections.map(function (direction) {
            if (allDirections.indexOf(direction) !== -1) {
                return (react_1.default.createElement(resize_trigger_1.default, { key: direction, className: prefixCls + "-direction-" + direction, direction: getIsHorizontal(direction) ? 'horizontal' : 'vertical', icon: resizeIcons[direction], onMouseDown: function (e) {
                        onTriggerMouseDown(direction, e);
                    }, onResize: function (e) {
                        onTriggerResize(direction, e);
                    } }, resizeTriggers[direction]));
            }
        })));
}
var ForwardRefResizeBox = (0, react_1.forwardRef)(ResizeBox);
var ResizeBoxComponent = ForwardRefResizeBox;
ResizeBoxComponent.Split = split_1.default;
ResizeBoxComponent.SplitGroup = split_group_1.default;
ResizeBoxComponent.displayName = 'ResizeBox';
exports.default = ResizeBoxComponent;
