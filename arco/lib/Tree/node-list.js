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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var VirtualList_1 = __importDefault(require("../_class/VirtualList"));
var node_1 = __importDefault(require("./node"));
var scrollIntoView_1 = __importDefault(require("../_util/scrollIntoView"));
function getKey(option) {
    return option.key || option._key;
}
function NodeList(props, ref) {
    var className = props.className, style = props.style, filterNode = props.filterNode, virtualListProps = props.virtualListProps, expandedKeys = props.expandedKeys, currentExpandKeys = props.currentExpandKeys, nodeList = props.nodeList, getNodeProps = props.getNodeProps, getDataSet = props.getDataSet;
    var isVirtual = (virtualListProps === null || virtualListProps === void 0 ? void 0 : virtualListProps.threshold) !== null;
    var virtualListRef = (0, react_1.useRef)();
    var treeWrapperRef = (0, react_1.useRef)();
    var dataSetRef = (0, react_1.useRef)();
    var expandedKeysSet = (0, react_1.useMemo)(function () { return new Set(expandedKeys); }, [expandedKeys]);
    var visibleKeys = (0, react_1.useMemo)(function () {
        var newKeys = new Set();
        var currentExpandKeysSet = new Set(currentExpandKeys);
        nodeList.forEach(function (nodeProps) {
            var pathParentKeys = nodeProps.pathParentKeys || [];
            // 如果父节点处于正在展开状态，子节点暂时不可见，因为父节点的children会在animation中渲染出来。
            // 当动画完成时，父节点children隐藏，此时在这里渲染子节点。 anyway，一切为了动画！！！
            if (pathParentKeys.every(function (key) { return !currentExpandKeysSet.has(key) && expandedKeysSet.has(key); })) {
                newKeys.add(nodeProps._key);
            }
        });
        return newKeys;
    }, [expandedKeysSet, currentExpandKeys, nodeList]);
    var calcChildrenList = function () {
        return nodeList.filter(function (item) {
            var pass = !filterNode || (filterNode && filterNode(item));
            if (pass && visibleKeys.has(item.key)) {
                return true;
            }
            return false;
        });
    };
    // 默认值不能为nodeList，防止在设置defaultExpandedKeys 时，应该被隐藏的节点初始化的时候展示了。
    var childrenList = (0, react_1.useMemo)(function () {
        return calcChildrenList();
    }, [nodeList, filterNode, visibleKeys]);
    (0, react_1.useImperativeHandle)(ref, function () {
        return {
            // index: 第几个dom元素, 如果传入的是字符串，会作为 node 的 key去查找。
            // nodeProps: _index 是 key 时，对应的node
            scrollIntoView: function (_index, nodeProps) {
                var index = _index;
                var isKey = typeof _index === 'string';
                if (isKey) {
                    var key_1 = _index;
                    // 查找离得最近的可见的父节点，进行滚动。
                    if (!visibleKeys.has(_index) && nodeProps && nodeProps.pathParentKeys) {
                        key_1 =
                            __spreadArray([], __read(nodeProps.pathParentKeys), false).reverse().find(function (key) { return visibleKeys.has(key); }) || index;
                    }
                    // _index attributes and index are not the same due to some hidden items
                    index = childrenList.findIndex(function (_a) {
                        var _key = _a._key;
                        return _key === key_1;
                    });
                }
                if (!isVirtual && treeWrapperRef.current) {
                    var wrapperDom = treeWrapperRef.current;
                    var node = wrapperDom ? wrapperDom.children[index] : null;
                    node &&
                        (0, scrollIntoView_1.default)(node, {
                            boundary: wrapperDom.parentElement,
                        });
                }
                else if (virtualListRef.current) {
                    virtualListRef.current.scrollTo({ index: index });
                }
            },
        };
    });
    return isVirtual ? (react_1.default.createElement(VirtualList_1.default, __assign({ className: className, style: style, ref: virtualListRef, data: childrenList, isStaticItemHeight: false, itemKey: getKey, onMouseDown: props.onMouseDown }, props.ariaProps, virtualListProps), function (item, _, _a) {
        var itemIndex = _a.itemIndex;
        if (itemIndex === 0) {
            dataSetRef.current = getDataSet();
        }
        var nodeProps = getNodeProps(item, dataSetRef.current);
        var node = react_1.default.createElement(node_1.default, __assign({}, item, { key: item.key }, nodeProps));
        return node;
    })) : (react_1.default.createElement("div", __assign({ role: "tree", tabIndex: 0, className: className, style: style, ref: treeWrapperRef }, props.ariaProps, { onMouseDown: props.onMouseDown }), childrenList.map(function (item) {
        var nodeProps = getNodeProps(item);
        var node = react_1.default.createElement(node_1.default, __assign({}, nodeProps, { key: item.key }));
        return node;
    })));
}
exports.default = (0, react_1.forwardRef)(NodeList);
