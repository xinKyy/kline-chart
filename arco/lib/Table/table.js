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
var debounce_1 = __importDefault(require("lodash/debounce"));
var throttle_1 = __importDefault(require("lodash/throttle"));
var b_tween_1 = __importDefault(require("b-tween"));
var is_1 = require("../_util/is");
var classNames_1 = __importDefault(require("../_util/classNames"));
var Spin_1 = __importDefault(require("../Spin"));
var index_1 = __importDefault(require("./thead/index"));
var index_2 = __importDefault(require("./tbody/index"));
var index_3 = __importDefault(require("./tfoot/index"));
var Pagination_1 = __importDefault(require("../Pagination"));
var dom_1 = require("../_util/dom");
var ConfigProvider_1 = require("../ConfigProvider");
var utils_1 = require("./utils");
var colgroup_1 = __importDefault(require("./colgroup"));
var useExpand_1 = __importDefault(require("./hooks/useExpand"));
var useRowSelection_1 = __importDefault(require("./hooks/useRowSelection"));
var useComponent_1 = __importDefault(require("./hooks/useComponent"));
var useStickyOffsets_1 = __importDefault(require("./hooks/useStickyOffsets"));
var useStickyClassNames_1 = __importDefault(require("./hooks/useStickyClassNames"));
var useColumns_1 = __importDefault(require("./hooks/useColumns"));
var useUpdate_1 = __importDefault(require("../_util/hooks/useUpdate"));
var resizeObserver_1 = __importDefault(require("../_util/resizeObserver"));
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var useIsomorphicLayoutEffect_1 = __importDefault(require("../_util/hooks/useIsomorphicLayoutEffect"));
var pick_1 = require("../_util/pick");
var useSorter_1 = __importDefault(require("./hooks/useSorter"));
var EMPTY_DATA = [];
var EMPTY_COLUMNS = [];
var defaultProps = {
    showHeader: true,
    border: true,
    hover: true,
    rowKey: 'key',
    pagePosition: 'br',
    childrenColumnName: 'children',
    indentSize: 15,
    showSorterTooltip: true,
};
function Table(baseProps, ref) {
    var _a, _b;
    var _c, _d;
    var _e = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _e.getPrefixCls, loadingElement = _e.loadingElement, ctxSize = _e.size, tablePagination = _e.tablePagination, renderEmpty = _e.renderEmpty, componentConfig = _e.componentConfig, rtl = _e.rtl;
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Table);
    // priority: props.pagination > ConfigProvider.tablePagination > ConfigProvider.Table.pagination
    var mergePagination = (0, useMergeProps_1.default)((0, is_1.isObject)(baseProps === null || baseProps === void 0 ? void 0 : baseProps.pagination) ? baseProps === null || baseProps === void 0 ? void 0 : baseProps.pagination : {}, (0, is_1.isObject)((_c = componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Table) === null || _c === void 0 ? void 0 : _c.pagination) ? (_d = componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Table) === null || _d === void 0 ? void 0 : _d.pagination : {}, tablePagination || {});
    var style = props.style, className = props.className, components = props.components, border = props.border, borderCell = props.borderCell, _f = props.columns, columns = _f === void 0 ? EMPTY_COLUMNS : _f, _g = props.data, data = _g === void 0 ? EMPTY_DATA : _g, scroll = props.scroll, noDataElement = props.noDataElement, showHeader = props.showHeader, stripe = props.stripe, hover = props.hover, pagination = props.pagination, onChange = props.onChange, pagePosition = props.pagePosition, childrenColumnName = props.childrenColumnName, indentSize = props.indentSize, rowSelection = props.rowSelection, tableLayoutFixed = props.tableLayoutFixed, footer = props.footer, virtualized = props.virtualized, renderPagination = props.renderPagination, summary = props.summary, rowKey = props.rowKey;
    var clonedData = (0, react_1.useMemo)(function () { return (0, utils_1.deepCloneData)(data, childrenColumnName); }, [data, childrenColumnName]);
    var prefixCls = getPrefixCls('table');
    // configProvider 提供的size可能和table size 不匹配，此时默认 'default'
    var size = props.size || (['default', 'middle', 'small'].indexOf(ctxSize) > -1 ? ctxSize : 'default');
    var refTableHead = (0, react_1.useRef)(null);
    var refTableBody = (0, react_1.useRef)(null);
    var refTableFoot = (0, react_1.useRef)(null);
    var refTable = (0, react_1.useRef)(null);
    var refVirtualList = (0, react_1.useRef)(null);
    // Not fixed header
    var refTableNF = (0, react_1.useRef)(null);
    var lastScrollLeft = (0, react_1.useRef)(0);
    var scrollbarChanged = (0, react_1.useRef)(false);
    var _h = __read((0, useColumns_1.default)(props), 2), groupColumns = _h[0], flattenColumns = _h[1];
    var _j = getDefaultFiltersAndSorters(), currentFilters = _j.currentFilters, defaultSorters = _j.defaultSorters;
    var _k = __read((0, react_1.useState)(1), 2), currentPage = _k[0], setCurrentPage = _k[1];
    var _l = __read((0, react_1.useState)(mergePagination.pageSize || mergePagination.defaultPageSize || 10), 2), innerPageSize = _l[0], setInnerPageSize = _l[1];
    var _m = __read((0, react_1.useState)(currentFilters), 2), filters = _m[0], setFilters = _m[1];
    var _o = __read((0, react_1.useState)(0), 2), tableViewWidth = _o[0], setTableViewWidth = _o[1];
    var _p = __read((0, react_1.useState)([]), 2), columnWidths = _p[0], setColumnWidths = _p[1];
    var stickyOffsets = (0, useStickyOffsets_1.default)(flattenColumns);
    var _q = __read((0, useStickyClassNames_1.default)(groupColumns, flattenColumns, prefixCls), 2), groupStickyClassNames = _q[0], stickyClassNames = _q[1];
    var _r = (0, useSorter_1.default)(flattenColumns, defaultSorters), currentSorter = _r.currentSorter, activeSorters = _r.activeSorters, getNextActiveSorters = _r.getNextActiveSorters, updateStateSorters = _r.updateStateSorters;
    var _s = (0, useComponent_1.default)(components), ComponentTable = _s.ComponentTable, ComponentBodyWrapper = _s.ComponentBodyWrapper, ComponentHeaderWrapper = _s.ComponentHeaderWrapper;
    var getRowKey = (0, react_1.useMemo)(function () {
        if (typeof rowKey === 'function') {
            return function (record) { return rowKey((0, utils_1.getOriginData)(record)); };
        }
        return function (record) { return record[rowKey]; };
    }, [rowKey]);
    function getDefaultFiltersAndSorters() {
        var currentFilters = {};
        var defaultSorters = [];
        flattenColumns.forEach(function (column) {
            var innerDataIndex = column.key;
            if (column.defaultFilters) {
                currentFilters[innerDataIndex] = column.defaultFilters;
            }
            if (column.filteredValue) {
                currentFilters[innerDataIndex] = column.filteredValue;
            }
            if ('defaultSortOrder' in column || 'sortOrder' in column) {
                var priority = (0, utils_1.getSorterPriority)(column.sorter);
                var direction = 'sortOrder' in column ? column.sortOrder : column.defaultSortOrder;
                var sorter = {
                    field: innerDataIndex,
                    direction: direction,
                    sorterFn: (0, utils_1.getSorterFn)(column.sorter),
                    priority: priority,
                };
                if (!direction) {
                    defaultSorters.push(sorter);
                }
                else if ((0, is_1.isNumber)(priority)) {
                    if (defaultSorters.every(function (item) { return (0, is_1.isNumber)(item.priority) || !item.direction; })) {
                        defaultSorters.push(sorter);
                    }
                }
                else if (defaultSorters.every(function (item) { return !item.direction; })) {
                    defaultSorters.push(sorter);
                }
                else {
                    defaultSorters = [sorter];
                }
            }
        });
        return { currentFilters: currentFilters, defaultSorters: defaultSorters };
    }
    var controlledFilter = (0, react_1.useMemo)(function () {
        // 允许 filteredValue 设置为 undefined 表示不筛选
        var flattenFilteredValueColumns = flattenColumns.filter(function (column) { return 'filteredValue' in column; });
        var newFilters = {};
        // 受控的筛选，当columns中的筛选发生改变时，更新state
        if (flattenFilteredValueColumns.length) {
            flattenFilteredValueColumns.forEach(function (column, index) {
                var innerDataIndex = column.key || column.dataIndex || index;
                if (innerDataIndex !== undefined) {
                    newFilters[innerDataIndex] = column.filteredValue;
                }
            });
        }
        return newFilters;
    }, [flattenColumns]);
    var innerFilters = (0, react_1.useMemo)(function () {
        return Object.keys(controlledFilter).length ? controlledFilter : filters;
    }, [filters, controlledFilter]);
    /** ----------- Sorter ----------- */
    function onSort(direction, field) {
        var column = getColumnByUniqueKey(field);
        if (!column) {
            return;
        }
        var sorter = {
            direction: direction,
            field: field,
            sorterFn: (0, utils_1.getSorterFn)(column.sorter),
            priority: (0, utils_1.getSorterPriority)(column.sorter),
        };
        var nextActiveSorters = getNextActiveSorters(sorter);
        updateStateSorters(sorter, nextActiveSorters);
        var newProcessedData = getProcessedData(sorter, nextActiveSorters, innerFilters);
        var currentData = getPageData(newProcessedData);
        onChange &&
            onChange(getPaginationProps(newProcessedData), sorter, innerFilters, {
                currentData: (0, utils_1.getOriginData)(currentData),
                currentAllData: (0, utils_1.getOriginData)(newProcessedData),
                action: 'sort',
            });
    }
    function compareFn(activeSorters) {
        var compare = function (fn, direction) {
            return function (a, b) {
                var result = fn(a, b);
                return direction === 'descend' ? -result : result;
            };
        };
        var sorters = __spreadArray([], __read(activeSorters), false);
        sorters.sort(function (a, b) { return b.priority - a.priority; });
        return function (a, b) {
            for (var i = 0, l = sorters.length; i < l; i++) {
                var _a = sorters[i], sorterFn = _a.sorterFn, direction = _a.direction;
                if (typeof sorterFn !== 'function') {
                    continue;
                }
                var result = compare(sorterFn, direction)(a, b);
                if (result !== 0) {
                    return result;
                }
            }
            return 0;
        };
    }
    /** ----------- Sorter End ----------- */
    /** ----------- Filters ----------- */
    function onHandleFilter(column, filter) {
        var _a;
        var newFilters = __assign(__assign({}, innerFilters), (_a = {}, _a[column.dataIndex] = filter, _a));
        var mergedFilters = __assign(__assign({}, newFilters), controlledFilter);
        if ((0, is_1.isArray)(filter) && filter.length) {
            setFilters(mergedFilters);
            var newProcessedData = getProcessedData(currentSorter, activeSorters, newFilters);
            var currentData = getPageData(newProcessedData);
            onChange &&
                onChange(getPaginationProps(newProcessedData), activeSorters.length === 1 ? activeSorters[0] : activeSorters, newFilters, {
                    currentData: (0, utils_1.getOriginData)(currentData),
                    currentAllData: (0, utils_1.getOriginData)(newProcessedData),
                    action: 'filter',
                });
        }
        else if ((0, is_1.isArray)(filter) && !filter.length) {
            onHandleFilterReset(column);
        }
    }
    function onHandleFilterReset(_a) {
        var dataIndex = _a.dataIndex;
        var newFilters = __assign({}, innerFilters);
        delete newFilters[dataIndex];
        setFilters(newFilters);
        var newProcessedData = getProcessedData(currentSorter, activeSorters, newFilters);
        var currentData = getPageData(newProcessedData);
        onChange &&
            onChange(getPaginationProps(newProcessedData), activeSorters.length === 1 ? activeSorters[0] : activeSorters, newFilters, {
                currentData: (0, utils_1.getOriginData)(currentData),
                currentAllData: (0, utils_1.getOriginData)(newProcessedData),
                action: 'filter',
            });
    }
    /** ----------- Filters End ----------- */
    var hasFixedColumnLeft = !!flattenColumns.find(function (c) { return c.fixed === 'left'; });
    var hasFixedColumnRight = !!flattenColumns.find(function (c) { return c.fixed === 'right'; });
    var hasFixedColumn = hasFixedColumnLeft || hasFixedColumnRight;
    function getProcessedData(currentSorter, activeSorters, filters) {
        var _data = (clonedData || []).slice();
        Object.keys(filters).forEach(function (field) {
            if (filters[field] && filters[field].length) {
                var column_1 = getColumnByUniqueKey(field);
                if (column_1 && typeof column_1.onFilter === 'function') {
                    _data = _data.filter(function (row) {
                        return filters[field].reduce(function (pre, cur) { return pre || column_1.onFilter(cur, row); }, false);
                    });
                }
            }
        });
        var getSortData = function (d) {
            return d
                .slice()
                .sort(compareFn(activeSorters))
                .map(function (item) {
                var _a;
                if ((0, is_1.isArray)(item[childrenColumnName])) {
                    return __assign(__assign({}, item), (_a = {}, _a[childrenColumnName] = getSortData(item[childrenColumnName]), _a));
                }
                return item;
            });
        };
        if ((currentSorter.direction && typeof currentSorter.sorterFn === 'function') ||
            activeSorters.length) {
            return getSortData(_data);
        }
        return _data;
    }
    // 获得经过 sorter 和 filters 筛选之后的 data
    var processedData = getProcessedData(currentSorter, activeSorters, innerFilters);
    function getPaginationProps(_processedData) {
        if (_processedData === void 0) { _processedData = processedData; }
        var pageSize = mergePagination.pageSize || innerPageSize || 10;
        var paginationSize = size === 'middle' ? 'default' : size;
        var selectPopupPosition = 'top';
        if (pagePosition === 'tl' || pagePosition === 'bl') {
            selectPopupPosition = 'bottom';
        }
        else {
            selectPopupPosition = 'top';
        }
        var total = (0, is_1.isArray)(_processedData) ? _processedData.length : 0;
        var current = Math.ceil(total / pageSize) < currentPage ? 1 : currentPage;
        if (current !== currentPage) {
            setCurrentPage(current);
        }
        var paginationProps = {
            size: paginationSize,
            total: total,
            pageSize: pageSize,
            current: current,
            selectProps: {
                triggerProps: {
                    position: selectPopupPosition,
                },
            },
        };
        if (typeof pagination === 'object' && pagination.selectProps) {
            paginationProps.selectProps = __assign(__assign({}, paginationProps.selectProps), pagination.selectProps);
        }
        if ((0, is_1.isObject)(pagination)) {
            paginationProps = __assign(__assign({}, paginationProps), pagination);
        }
        if ((0, is_1.isObject)(mergePagination)) {
            paginationProps = __assign(__assign({}, paginationProps), mergePagination);
        }
        paginationProps.onChange = onPaginationChange;
        return paginationProps;
    }
    var paginationProps = getPaginationProps();
    var pageData = getPageData();
    function getPageData(currentData, _paginationProps) {
        if (currentData === void 0) { currentData = processedData; }
        if (_paginationProps === void 0) { _paginationProps = paginationProps; }
        var _a = _paginationProps.current, current = _a === void 0 ? 0 : _a, _b = _paginationProps.pageSize, pageSize = _b === void 0 ? 10 : _b;
        if (pagination === false) {
            return currentData;
        }
        if ((0, is_1.isObject)(pagination) && data.length <= pageSize) {
            return currentData;
        }
        return currentData.slice((current - 1) * pageSize, current * pageSize);
    }
    var throttleResizeHandler = (0, debounce_1.default)(resizeHandler, 100);
    var fixedHeader = !!(scroll && scroll.y);
    var summaryNode = summary === null || summary === void 0 ? void 0 : summary((0, utils_1.getOriginData)(processedData));
    var fixedFooterPosition = summary && react_1.default.isValidElement(summaryNode) && summaryNode.props.fixed;
    var fixedFooter = fixedHeader && fixedFooterPosition;
    (0, useIsomorphicLayoutEffect_1.default)(function () {
        resizeHandler();
        (0, dom_1.on)(window, 'resize', throttleResizeHandler);
        var tableHead = refTableHead.current;
        var tableBody = refTableBody.current;
        var tableFoot = refTableFoot.current;
        if (tableBody) {
            (0, dom_1.on)(tableBody, 'scroll', tableScrollHandler);
        }
        var theadScrollContainer = tableHead && tableHead.parentNode;
        if (tableHead) {
            if (theadScrollContainer) {
                (0, dom_1.on)(theadScrollContainer, 'scroll', tableScrollHandler);
            }
        }
        if (tableFoot) {
            (0, dom_1.on)(tableFoot, 'scroll', tableScrollHandler);
        }
        return function () {
            (0, dom_1.off)(window, 'resize', throttleResizeHandler);
            if (tableBody) {
                (0, dom_1.off)(tableBody, 'scroll', tableScrollHandler);
            }
            if (theadScrollContainer) {
                (0, dom_1.off)(theadScrollContainer, 'scroll', tableScrollHandler);
            }
            if (tableFoot) {
                (0, dom_1.off)(tableFoot, 'scroll', tableScrollHandler);
            }
        };
    }, [hasFixedColumnLeft, hasFixedColumnRight, scroll === null || scroll === void 0 ? void 0 : scroll.x, scroll === null || scroll === void 0 ? void 0 : scroll.y, flattenColumns.length, data]);
    (0, useUpdate_1.default)(function () {
        var _a = getPaginationProps(data), total = _a.total, pageSize = _a.pageSize;
        var maxPageNum = Math.ceil(total / pageSize);
        if (maxPageNum < currentPage) {
            setCurrentPage(1);
        }
    }, [data === null || data === void 0 ? void 0 : data.length]);
    (0, useUpdate_1.default)(function () {
        setFixedColumnClassNames();
    }, [data, hasFixedColumnLeft, hasFixedColumnRight, rtl]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getRootDomElement: getRootDomElement,
        scrollIntoView: function (dataIndex) {
            if (refVirtualList.current) {
                refVirtualList.current.scrollTo({ key: dataIndex });
            }
        },
    }); });
    function getRootDomElement() {
        return refTable.current;
    }
    function resizeHandler() {
        setFixedColumnClassNames();
        var root = getRootDomElement();
        if (root && (hasFixedColumn || (scroll && scroll.x))) {
            var ele = root.querySelector("." + prefixCls + "-body") ||
                root.querySelector("." + prefixCls + "-content-inner");
            var tableViewWidth_1 = ele.getBoundingClientRect().width;
            setTableViewWidth(tableViewWidth_1);
        }
    }
    var setPositionClassNames = (0, react_1.useCallback)((0, throttle_1.default)(function () {
        var table = refTable.current;
        var tbody = (fixedHeader ? refTableBody.current : refTableNF.current && refTableNF.current.parentNode);
        if (tbody) {
            var scrollLeft = rtl ? -tbody.scrollLeft : tbody.scrollLeft;
            var alignLeft = scrollLeft === 0;
            // const alignRight = tbody.scrollLeft + tbody.clientWidth >= tbody.scrollWidth;
            var alignRight = scrollLeft + 1 >=
                tbody.children[0].getBoundingClientRect().width - tbody.getBoundingClientRect().width;
            if (alignLeft && alignRight) {
                setFixedColumnsClassList(table.classList, prefixCls + "-scroll-position-both");
            }
            else if (alignLeft) {
                setFixedColumnsClassList(table.classList, prefixCls + "-scroll-position-" + (rtl ? 'right' : 'left'));
            }
            else if (alignRight) {
                setFixedColumnsClassList(table.classList, prefixCls + "-scroll-position-" + (rtl ? 'left' : 'right'));
            }
            else {
                setFixedColumnsClassList(table.classList, prefixCls + "-scroll-position-middle");
            }
        }
        else {
            table && resetTableClassName(table.classList);
        }
    }, 100), [refTable.current, refTableBody.current, fixedHeader, rtl]);
    function setFixedColumnClassNames() {
        if (hasFixedColumn || (scroll && (0, is_1.isObject)(scroll) && scroll.x)) {
            var table = refTable.current;
            if (table) {
                if (hasFixedColumnLeft) {
                    setTableFixedClassName(table.classList, prefixCls + "-has-fixed-col-left");
                }
                if (hasFixedColumnRight) {
                    setTableFixedClassName(table.classList, prefixCls + "-has-fixed-col-right");
                }
            }
            setPositionClassNames();
        }
    }
    function setTableFixedClassName(tableClassList, className) {
        if (!tableClassList.contains(className)) {
            tableClassList.add(className);
        }
    }
    function resetTableClassName(classList) {
        classList.remove(prefixCls + "-scroll-position-both");
        classList.remove(prefixCls + "-scroll-position-left");
        classList.remove(prefixCls + "-scroll-position-right");
        classList.remove(prefixCls + "-scroll-position-middle");
    }
    function setFixedColumnsClassList(classList, className) {
        if (!classList.contains(className)) {
            resetTableClassName(classList);
            classList.add(className);
        }
    }
    var _t = (0, useRowSelection_1.default)(props, pageData, clonedData, getRowKey), selectedRowKeys = _t.selectedRowKeys, indeterminateKeys = _t.indeterminateKeys, onCheckAll = _t.onCheckAll, onCheck = _t.onCheck, onCheckRadio = _t.onCheckRadio, setSelectedRowKeys = _t.setSelectedRowKeys, allSelectedRowKeys = _t.allSelectedRowKeys, flattenData = _t.flattenData;
    // flattenColumns 在构造时优先使用了 column.key 作为主键，在查询时使用 getColumnByDataIndex 方法可能会导致bug。
    function getColumnByUniqueKey(key) {
        return flattenColumns.find(function (column, index) {
            if (typeof column.key !== 'undefined') {
                if (typeof column.key === 'number' && typeof key === 'string') {
                    return column.key.toString() === key;
                }
                return column.key === key;
            }
            // unnecessary
            if (typeof column.dataIndex !== 'undefined') {
                return column.dataIndex === key;
            }
            if (typeof key === 'number') {
                return index === key;
            }
            return false;
        });
    }
    function onPaginationChange(current, pageSize) {
        setCurrentPage(current);
        setInnerPageSize(pageSize);
        if (current !== currentPage) {
            scrollToTop();
        }
        if (rowSelection && !rowSelection.checkCrossPage && selectedRowKeys.length) {
            setSelectedRowKeys([]);
            rowSelection.onChange && rowSelection.onChange([], []);
        }
        var newPaginationProps = __assign(__assign({}, getPaginationProps()), { current: current, pageSize: pageSize });
        onChange &&
            onChange(newPaginationProps, activeSorters.length === 1 ? activeSorters[0] : activeSorters, innerFilters, {
                currentData: (0, utils_1.getOriginData)(getPageData(processedData, newPaginationProps)),
                currentAllData: (0, utils_1.getOriginData)(processedData),
                action: 'paginate',
            });
        mergePagination.onChange && mergePagination.onChange(current, pageSize);
    }
    function scrollToTop() {
        var tableBody = refTableBody.current;
        if (!tableBody) {
            return;
        }
        var scrollTop = refTableBody.current.scrollTop;
        var tween = new b_tween_1.default({
            from: { scrollTop: scrollTop },
            to: { scrollTop: 0 },
            easing: 'quintInOut',
            duration: 300,
            onUpdate: function (keys) {
                if (refTableBody.current) {
                    refTableBody.current.scrollTop = keys.scrollTop;
                }
            },
        });
        tween.start();
    }
    function tableScrollHandler(e) {
        var target = e.target;
        var tbody = refTableBody.current;
        var theadScrollContainer = refTableHead.current && refTableHead.current.parentNode;
        var tfoot = refTableFoot.current;
        if (target.scrollLeft !== lastScrollLeft.current) {
            if (theadScrollContainer) {
                theadScrollContainer.scrollLeft = target.scrollLeft;
            }
            if (tbody) {
                tbody.scrollLeft = target.scrollLeft;
            }
            if (tfoot) {
                tfoot.scrollLeft = target.scrollLeft;
            }
            setFixedColumnClassNames();
        }
        lastScrollLeft.current = e.target.scrollLeft;
    }
    // isFixedHeader = false
    function tableScrollHandlerNF(e) {
        var target = e.target;
        var table = refTableNF.current;
        if (target.scrollLeft !== lastScrollLeft.current) {
            table.scrollLeft = target.scrollLeft;
            setFixedColumnClassNames();
        }
        lastScrollLeft.current = e.target.scrollLeft;
    }
    var _u = __read((0, useExpand_1.default)(props, flattenData, getRowKey), 2), expandedRowKeys = _u[0], onClickExpandBtn = _u[1];
    var scrollStyleY = {};
    var scrollStyleX = {};
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
    function setScrollBarStyle() {
        var wrapper = refTableHead.current && refTableHead.current.parentNode;
        var scrollBarHeight = (0, utils_1.getScrollBarHeight)(wrapper);
        if (scrollBarHeight && scrollBarHeight > 0) {
            wrapper.style.marginBottom = "-" + scrollBarHeight + "px";
            wrapper.style.paddingBottom = '0px';
            if (refTableFoot.current) {
                refTableFoot.current.style.marginBottom = "-" + scrollBarHeight + "px";
                refTableFoot.current.style.paddingBottom = '0px';
            }
        }
        // 根据 Tbody 决定 Thead 是否显示纵向滚动条
        // TODO: Remove
        setTimeout(function () {
            var scrollWrapper = refTableBody.current;
            var scrollBarWidth = (0, utils_1.getScrollBarWidth)(scrollWrapper);
            if (scrollBarWidth) {
                scrollbarChanged.current = true;
                if (wrapper) {
                    wrapper.style.overflowY = 'scroll';
                }
                if (refTableFoot.current) {
                    refTableFoot.current.style.overflowY = 'scroll';
                }
            }
            else if (wrapper && scrollbarChanged.current) {
                scrollbarChanged.current = false;
                wrapper.style.overflowY = 'auto';
                if (refTableFoot.current) {
                    refTableFoot.current.style.overflowY = 'auto';
                }
            }
        });
    }
    var theadNode = (react_1.default.createElement(index_1.default, __assign({}, props, { activeSorters: activeSorters, currentSorter: currentSorter, selectedRowKeys: selectedRowKeys, currentFilters: innerFilters, onCheckAll: onCheckAll, onSort: onSort, data: pageData, onHandleFilter: onHandleFilter, onHandleFilterReset: onHandleFilterReset, prefixCls: prefixCls, allSelectedRowKeys: allSelectedRowKeys, groupColumns: groupColumns, stickyOffsets: stickyOffsets, groupStickyClassNames: groupStickyClassNames })));
    function renderThead() {
        var maxContentWidth = (0, is_1.isObject)(scroll) && scroll.x === 'max-content';
        return fixedHeader || virtualized ? (react_1.default.createElement(ComponentHeaderWrapper, { className: prefixCls + "-header" },
            react_1.default.createElement(ComponentTable, { ref: refTableHead, style: maxContentWidth ? {} : scrollStyleX },
                react_1.default.createElement(colgroup_1.default, { columns: flattenColumns, prefixCls: prefixCls, producer: false, columnWidths: maxContentWidth && scroll.y ? columnWidths : null }),
                theadNode))) : (theadNode);
    }
    var footerNode = summaryNode && (react_1.default.createElement(index_3.default, { prefixCls: prefixCls, summary: summary, data: pageData, columns: flattenColumns, stickyOffsets: stickyOffsets, stickyClassNames: stickyClassNames }));
    var tbodyNode = (react_1.default.createElement(index_2.default, __assign({}, props, { selectedRowKeys: selectedRowKeys, indeterminateKeys: indeterminateKeys, expandedRowKeys: expandedRowKeys, onCheck: onCheck, onCheckRadio: onCheckRadio, onClickExpandBtn: onClickExpandBtn, columns: flattenColumns, data: pageData, prefixCls: prefixCls, hasFixedColumn: hasFixedColumn, tableViewWidth: tableViewWidth, indentSize: indentSize, noDataElement: noDataElement || renderEmpty('Table'), activeSorters: activeSorters, currentSorter: currentSorter, stickyOffsets: stickyOffsets, stickyClassNames: stickyClassNames, getRowKey: getRowKey, saveVirtualListRef: function (ref) {
            if (virtualized) {
                refVirtualList.current = ref;
                refTableBody.current = ref === null || ref === void 0 ? void 0 : ref.dom;
            }
        } })));
    var tbody = !virtualized && !fixedFooter ? (react_1.default.createElement(react_1.default.Fragment, null,
        tbodyNode,
        footerNode)) : (tbodyNode);
    function renderTbody() {
        var producer = (0, is_1.isObject)(scroll) &&
            scroll.x === 'max-content' &&
            !!scroll.y &&
            (0, is_1.isArray)(data) &&
            data.length > 0;
        return (react_1.default.createElement(resizeObserver_1.default, { onResize: setScrollBarStyle }, fixedHeader && !virtualized ? (react_1.default.createElement(ComponentBodyWrapper, { ref: refTableBody, className: prefixCls + "-body", style: scrollStyleY },
            react_1.default.createElement(ComponentTable, { style: scrollStyleX },
                react_1.default.createElement(colgroup_1.default, { columns: flattenColumns, prefixCls: prefixCls, producer: producer, onSetColumnWidths: setColumnWidths, expandedRowKeys: expandedRowKeys, data: data }),
                tbody))) : (tbody)));
    }
    function renderTable() {
        var scrollStyle = {};
        if (scroll && (0, is_1.isObject)(scroll) && scroll.x) {
            scrollStyle = {
                width: scroll.x,
            };
        }
        var summaryTableNode = (react_1.default.createElement("div", { className: prefixCls + "-tfoot", ref: refTableFoot },
            react_1.default.createElement(ComponentTable, { style: scrollStyle },
                react_1.default.createElement(colgroup_1.default, { columns: flattenColumns, prefixCls: prefixCls }),
                footerNode)));
        var summaryFixedTop = summaryNode && fixedHeader && fixedFooterPosition === 'top';
        var summaryFixedBottom = summaryNode && fixedHeader && fixedFooterPosition === 'bottom';
        var body = (react_1.default.createElement(react_1.default.Fragment, null,
            showHeader ? renderThead() : null,
            summaryFixedTop && summaryTableNode,
            renderTbody(),
            summaryFixedBottom && summaryTableNode));
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: prefixCls + "-container" },
                react_1.default.createElement("div", { className: prefixCls + "-content-scroll" },
                    react_1.default.createElement("div", { className: prefixCls + "-content-inner", onScroll: !fixedHeader ? tableScrollHandlerNF : undefined }, fixedHeader || virtualized ? (body) : (react_1.default.createElement(ComponentTable, { ref: refTableNF, style: scrollStyle },
                        react_1.default.createElement(colgroup_1.default, { prefixCls: prefixCls, columns: flattenColumns }),
                        body))))),
            typeof footer === 'function' && (react_1.default.createElement("div", { className: prefixCls + "-footer" }, footer(pageData)))));
    }
    if (!columns.length) {
        return null;
    }
    var showWrapperBorder = (0, is_1.isObject)(border) ? border.wrapper : border;
    var showCellBorder = (0, is_1.isObject)(border) ? border.cell : borderCell;
    var showHeaderCellBorder = (0, is_1.isObject)(border) ? border.cell || border.headerCell : borderCell;
    var showBodyCellBorder = (0, is_1.isObject)(border) ? border.cell || border.bodyCell : borderCell;
    var classNames = (0, classNames_1.default)(prefixCls, prefixCls + "-size-" + size, (_a = {},
        _a[prefixCls + "-border"] = showWrapperBorder,
        _a[prefixCls + "-border-cell"] = showCellBorder,
        _a[prefixCls + "-border-header-cell"] = !showCellBorder && showHeaderCellBorder,
        _a[prefixCls + "-border-body-cell"] = !showCellBorder && showBodyCellBorder,
        _a[prefixCls + "-stripe"] = stripe,
        _a[prefixCls + "-hover"] = hover,
        _a[prefixCls + "-type-radio"] = rowSelection && rowSelection.type === 'radio',
        _a[prefixCls + "-layout-fixed"] = tableLayoutFixed ||
            (scroll && (scroll.x || scroll.y)) ||
            columns.find(function (col) { return col.ellipsis; }),
        _a[prefixCls + "-fixed-column"] = hasFixedColumn,
        _a[prefixCls + "-virtualized"] = virtualized,
        _a[prefixCls + "-rtl"] = rtl,
        _a), className);
    var isPaginationTop = pagePosition === 'tl' || pagePosition === 'tr' || pagePosition === 'topCenter';
    var paginationClassName = (0, classNames_1.default)(prefixCls + "-pagination", (_b = {},
        _b[prefixCls + "-pagination-left"] = pagePosition === 'tl' || pagePosition === 'bl',
        _b[prefixCls + "-pagination-center"] = pagePosition === 'topCenter' || pagePosition === 'bottomCenter',
        _b[prefixCls + "-pagination-top"] = isPaginationTop,
        _b));
    var loading = props.loading;
    if (typeof loading === 'boolean') {
        loading = { loading: loading };
    }
    var customPagination = typeof renderPagination === 'function';
    var paginationEle = customPagination ? (renderPagination(react_1.default.createElement(Pagination_1.default, __assign({}, paginationProps)))) : (react_1.default.createElement("div", { className: paginationClassName },
        react_1.default.createElement(Pagination_1.default, __assign({}, paginationProps))));
    var showPagination = pagination !== false && (processedData.length !== 0 || paginationProps.total > 0);
    return (react_1.default.createElement("div", __assign({ ref: refTable, style: style, className: classNames }, (0, pick_1.pickDataAttributes)(props)),
        react_1.default.createElement(Spin_1.default, __assign({ element: loadingElement }, loading),
            showPagination && isPaginationTop && paginationEle,
            renderTable(),
            showPagination && !isPaginationTop && paginationEle)));
}
var TableComponent = (0, react_1.forwardRef)(Table);
TableComponent.displayName = 'Table';
exports.default = TableComponent;
