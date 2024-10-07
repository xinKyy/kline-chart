"use strict";
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
var react_1 = require("react");
var utils_1 = require("../utils");
var useUpdate_1 = __importDefault(require("../../_util/hooks/useUpdate"));
var is_1 = require("../../_util/is");
function useSorter(flattenColumns, defaultSorters) {
    var _a = __read((0, react_1.useState)(defaultSorters), 2), activeSorters = _a[0], setActiveSorters = _a[1];
    var _b = __read((0, react_1.useState)({}), 2), currentSorter = _b[0], setCurrentSorter = _b[1];
    var prevFlattenColumnsRef = (0, react_1.useRef)(flattenColumns);
    var getNextActiveSorters = (0, react_1.useCallback)(function (sorter) {
        var field = sorter.field, direction = sorter.direction;
        if (activeSorters.find(function (item) { return item.field === field; })) {
            if (!direction) {
                return activeSorters.filter(function (item) { return item.field !== field; });
            }
            return activeSorters.map(function (item) { return (item.field === field ? sorter : item); });
        }
        // This is theoretically impossible
        if (!direction) {
            return __spreadArray([], __read(activeSorters), false);
        }
        if (!(0, is_1.isNumber)(sorter.priority) || activeSorters.find(function (item) { return !(0, is_1.isNumber)(item.priority); })) {
            return [sorter];
        }
        return __spreadArray(__spreadArray([], __read(activeSorters), false), [sorter], false);
    }, [activeSorters]);
    var getControlledSorters = (0, react_1.useCallback)(function (columns) {
        var controlledColumns = columns.filter(function (column) { return 'sortOrder' in column; });
        var sorters = [];
        controlledColumns.forEach(function (column) {
            var priority = (0, utils_1.getSorterPriority)(column.sorter);
            var direction = column.sortOrder;
            var sorter = {
                field: column.key,
                direction: direction,
                sorterFn: (0, utils_1.getSorterFn)(column.sorter),
                priority: priority,
            };
            if (!direction) {
                sorters.push(sorter);
            }
            else if ((0, is_1.isNumber)(priority)) {
                if (sorters.every(function (item) { return (0, is_1.isNumber)(item.priority) || !item.direction; })) {
                    sorters.push(sorter);
                }
            }
            else if (sorters.every(function (item) { return !item.direction; })) {
                sorters.push(sorter);
            }
            else {
                sorters = [sorter];
            }
        });
        return sorters;
    }, []);
    var updateStateSorters = (0, react_1.useCallback)(function (sorter, nextActiveSorters) {
        var controlledSorters = getControlledSorters(flattenColumns);
        if (!controlledSorters.length) {
            setActiveSorters(nextActiveSorters);
            setCurrentSorter(sorter);
        }
    }, [flattenColumns, getControlledSorters, setActiveSorters, setCurrentSorter]);
    (0, useUpdate_1.default)(function () {
        var prevFlattenColumns = prevFlattenColumnsRef.current;
        var prevControlledSorters = getControlledSorters(prevFlattenColumns);
        var controlledSorters = getControlledSorters(flattenColumns);
        var prevControlledFields = prevControlledSorters.map(function (item) { return item.field; });
        var changedSorters = controlledSorters.filter(function (item) {
            var changed = prevControlledSorters.find(function (_a) {
                var field = _a.field, direction = _a.direction;
                return item.field === field && item.direction !== direction;
            });
            if (changed) {
                return true;
            }
            // 新增的sorter，用于处理开始不受控，之后又受控了的情况
            return !prevControlledFields.includes(item.field);
        });
        if (changedSorters && changedSorters.length) {
            setActiveSorters(controlledSorters);
            setCurrentSorter({});
        }
        // update prevFlattenColumns
        prevFlattenColumnsRef.current = flattenColumns;
    }, [
        flattenColumns,
        getControlledSorters,
        getNextActiveSorters,
        setCurrentSorter,
        setActiveSorters,
    ]);
    return {
        currentSorter: currentSorter,
        activeSorters: activeSorters,
        getNextActiveSorters: getNextActiveSorters,
        updateStateSorters: updateStateSorters,
    };
}
exports.default = useSorter;
