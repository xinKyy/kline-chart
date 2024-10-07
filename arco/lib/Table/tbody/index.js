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
var react_1 = __importStar(require("react"));
var is_1 = require("../../_util/is");
var classNames_1 = __importDefault(require("../../_util/classNames"));
var useComponent_1 = __importDefault(require("../hooks/useComponent"));
var VirtualList_1 = __importDefault(require("../../_class/VirtualList"));
var tr_1 = __importDefault(require("./tr"));
var utils_1 = require("../utils");
var DataRecordRenderer = (0, react_1.forwardRef)(function (_a, ref) {
    var record = _a.record, index = _a.index, virtualized = _a.virtualized, tbodyProps = _a.tbodyProps;
    var prefixCls = tbodyProps.prefixCls, columns = tbodyProps.columns, _b = tbodyProps.indentSize, indentSize = _b === void 0 ? 16 : _b, _c = tbodyProps.childrenColumnName, childrenColumnName = _c === void 0 ? 'children' : _c, _d = tbodyProps.expandProps, expandProps = _d === void 0 ? {} : _d, rowSelection = tbodyProps.rowSelection, hasFixedColumn = tbodyProps.hasFixedColumn, tableViewWidth = tbodyProps.tableViewWidth, getRowKey = tbodyProps.getRowKey, expandedRowKeys = tbodyProps.expandedRowKeys, expandedRowRender = tbodyProps.expandedRowRender;
    var type;
    if (rowSelection && 'type' in rowSelection) {
        type = rowSelection.type;
    }
    else if (rowSelection && !('type' in rowSelection)) {
        type = 'checkbox';
    }
    var er = expandedRowRender
        ? function (r, i) { return expandedRowRender((0, utils_1.getOriginData)(r), i); }
        : expandedRowRender;
    var isChildrenNotEmpty = function (record) {
        return (0, is_1.isArray)(record[childrenColumnName]) && record[childrenColumnName].length;
    };
    var shouldRowExpand = function (record, index) {
        if ('rowExpandable' in expandProps && typeof expandProps.rowExpandable === 'function') {
            return expandProps.rowExpandable(record);
        }
        return er && er(record, index) !== null;
    };
    var renderTreeTrs = function (record, index) {
        var trList = [];
        var trProps = __assign(__assign({}, tbodyProps), { type: type, shouldRowExpand: shouldRowExpand });
        // 存在 record.children 时，仅使用第一个元素作为 ref 返回，此时虚拟列表获得元素高度可能不太准确，但大致可用
        trList.push(react_1.default.createElement(tr_1.default, __assign({ ref: ref, key: getRowKey(record) }, trProps, { record: record, level: 0, index: index })));
        var travel = function (children, rowKey, level) {
            if (level === void 0) { level = 0; }
            if ((0, is_1.isArray)(children) && children.length) {
                children.forEach(function (child, i) {
                    if (expandedRowKeys.indexOf(rowKey) !== -1) {
                        trList.push(react_1.default.createElement(tr_1.default, __assign({}, trProps, { key: getRowKey(child), record: child, level: level + 1, index: i })));
                        if (isChildrenNotEmpty(child)) {
                            travel(child[childrenColumnName], getRowKey(child), level + 1);
                        }
                    }
                });
            }
        };
        if (!er) {
            travel(record[childrenColumnName], getRowKey(record));
        }
        return trList;
    };
    var rowK = getRowKey(record);
    var shouldRenderExpandIcon = shouldRowExpand(record, index) && expandedRowKeys.indexOf(rowK) !== -1;
    var TRTagName = virtualized ? 'div' : 'tr';
    var TDTagName = virtualized ? 'div' : 'td';
    return (react_1.default.createElement(react_1.default.Fragment, { key: rowK },
        renderTreeTrs(record, index),
        shouldRenderExpandIcon && (react_1.default.createElement(TRTagName, { key: rowK + "-expanded", className: (0, classNames_1.default)(prefixCls + "-tr", prefixCls + "-expand-content") },
            react_1.default.createElement(TDTagName, { className: (0, classNames_1.default)(prefixCls + "-td"), style: { paddingLeft: indentSize }, colSpan: columns.length }, hasFixedColumn ? (react_1.default.createElement("div", { className: prefixCls + "-expand-fixed-row", style: { width: tableViewWidth } }, er === null || er === void 0 ? void 0 : er(record, index))) : (er === null || er === void 0 ? void 0 : er(record, index)))))));
});
function TBody(props) {
    var data = props.data, columns = props.columns, prefixCls = props.prefixCls, components = props.components, noDataElement = props.noDataElement, scroll = props.scroll, tableViewWidth = props.tableViewWidth, virtualized = props.virtualized, virtualListProps = props.virtualListProps, getRowKey = props.getRowKey, saveVirtualListRef = props.saveVirtualListRef;
    var ComponentTbody = (0, useComponent_1.default)(components).ComponentTbody;
    var scrollStyleX = {};
    var scrollStyleY = {};
    if (scroll) {
        if (scroll.x && (typeof scroll.x === 'number' || typeof scroll.x === 'string')) {
            scrollStyleX = {
                width: scroll.x,
            };
        }
        if (scroll.y && (typeof scroll.y === 'number' || typeof scroll.y === 'string')) {
            scrollStyleY = {
                maxHeight: scroll.y,
            };
        }
    }
    var noElementProps = {
        className: prefixCls + "-no-data",
    };
    if (tableViewWidth) {
        noElementProps.className = prefixCls + "-no-data " + prefixCls + "-expand-fixed-row";
        noElementProps.style = { width: tableViewWidth };
    }
    var noDataTr = (react_1.default.createElement("tr", { className: (0, classNames_1.default)(prefixCls + "-tr", prefixCls + "-empty-row") },
        react_1.default.createElement("td", { className: prefixCls + "-td", colSpan: columns.length },
            react_1.default.createElement("div", __assign({}, noElementProps), noDataElement))));
    var renderDataRecord = function (record, index) { return (react_1.default.createElement(DataRecordRenderer, { key: index, record: record, index: index, virtualized: virtualized, tbodyProps: props })); };
    // https://github.com/arco-design/arco-design/issues/644
    // except the real scroll container, all parent nodes should not have a overflow style.
    if (virtualized) {
        return data.length > 0 ? (react_1.default.createElement(VirtualList_1.default, __assign({ data: data, height: scrollStyleY.maxHeight, isStaticItemHeight: false, 
            // position sticky works
            outerStyle: __assign(__assign({}, scrollStyleX), { minWidth: '100%', overflow: 'visible' }), innerStyle: { right: 'auto', minWidth: '100%' }, className: prefixCls + "-body", ref: function (ref) { return saveVirtualListRef(ref); }, itemKey: getRowKey }, virtualListProps), renderDataRecord)) : (react_1.default.createElement("div", { className: prefixCls + "-body" },
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, noDataTr))));
    }
    return react_1.default.createElement(ComponentTbody, null, data.length > 0 ? data.map(renderDataRecord) : noDataTr);
}
exports.default = TBody;
