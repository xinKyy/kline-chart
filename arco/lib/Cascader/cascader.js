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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFieldNames = void 0;
var react_1 = __importStar(require("react"));
var is_1 = require("../_util/is");
var Trigger_1 = __importDefault(require("../Trigger"));
var list_1 = __importDefault(require("./panel/list"));
var search_panel_1 = __importDefault(require("./panel/search-panel"));
var ConfigProvider_1 = require("../ConfigProvider");
var select_view_1 = __importDefault(require("../_class/select-view"));
var classNames_1 = __importDefault(require("../_util/classNames"));
var useMergeValue_1 = __importDefault(require("../_util/hooks/useMergeValue"));
var useUpdate_1 = __importDefault(require("../_util/hooks/useUpdate"));
var keycode_1 = require("../_util/keycode");
var useRefCurrent_1 = __importDefault(require("./hook/useRefCurrent"));
var useMergeProps_1 = __importDefault(require("../_util/hooks/useMergeProps"));
var util_1 = require("./util");
var useForceUpdate_1 = __importDefault(require("../_util/hooks/useForceUpdate"));
var useId_1 = __importDefault(require("../_util/hooks/useId"));
var IconLeft_1 = __importDefault(require("../../icon/react-icon-cjs/IconLeft"));
var IconRight_1 = __importDefault(require("../../icon/react-icon-cjs/IconRight"));
var IconLoading_1 = __importDefault(require("../../icon/react-icon-cjs/IconLoading"));
var IconCheck_1 = __importDefault(require("../../icon/react-icon-cjs/IconCheck"));
exports.DefaultFieldNames = {
    label: 'label',
    value: 'value',
    isLeaf: 'isLeaf',
    children: 'children',
    disabled: 'disabled',
};
var defaultProps = {
    options: [],
    bordered: true,
    fieldNames: exports.DefaultFieldNames,
    trigger: 'click',
    expandTrigger: 'click',
    checkedStrategy: util_1.SHOW_CHILD,
    defaultActiveFirstOption: true,
};
var triggerPopupAlign = { bottom: 4 };
function Cascader(baseProps, ref) {
    var _a = (0, react_1.useContext)(ConfigProvider_1.ConfigContext), getPrefixCls = _a.getPrefixCls, renderEmpty = _a.renderEmpty, componentConfig = _a.componentConfig, rtl = _a.rtl;
    var props = (0, useMergeProps_1.default)(baseProps, defaultProps, componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.Cascader);
    var disabled = props.disabled, renderFormat = props.renderFormat, getPopupContainer = props.getPopupContainer, children = props.children, triggerProps = props.triggerProps, expandTrigger = props.expandTrigger, icons = props.icons;
    var iconsMap = {
        loading: (icons === null || icons === void 0 ? void 0 : icons.loading) || react_1.default.createElement(IconLoading_1.default, null),
        checked: (icons === null || icons === void 0 ? void 0 : icons.checked) || react_1.default.createElement(IconCheck_1.default, null),
        next: (icons === null || icons === void 0 ? void 0 : icons.next) || (rtl ? react_1.default.createElement(IconLeft_1.default, null) : react_1.default.createElement(IconRight_1.default, null)),
    };
    var prefixCls = getPrefixCls('cascader');
    var isMultiple = props.mode === 'multiple';
    var timerRef = (0, react_1.useRef)(null);
    var forceUpdate = (0, useForceUpdate_1.default)();
    var store = (0, useRefCurrent_1.default)(function () {
        return (0, util_1.getStore)(props, (0, util_1.formatValue)('value' in props ? props.value : props.defaultValue, isMultiple));
    }, [JSON.stringify((0, util_1.getConfig)(props)), props.options]);
    var _b = __read((0, react_1.useState)(function () {
        return 'value' in props
            ? (0, util_1.formatValue)(props.value, isMultiple, store)
            : 'defaultValue' in props
                ? (0, util_1.formatValue)(props.defaultValue, isMultiple, store)
                : [];
    }), 2), stateValue = _b[0], setValue = _b[1];
    var mergeValue = 'value' in props ? (0, util_1.formatValue)(props.value, isMultiple, store) : stateValue;
    var _c = __read((0, useMergeValue_1.default)(false, {
        value: props.popupVisible,
        defaultValue: props.defaultPopupVisible,
    }), 2), popupVisible = _c[0], setPopupVisible = _c[1];
    var _d = __read((0, useMergeValue_1.default)('', {
        value: 'inputValue' in props ? props.inputValue || '' : undefined,
    }), 3), inputValue = _d[0], setInputValue = _d[1], stateInputValue = _d[2];
    // 触发 onInputValueChange 回调的值
    var refOnInputChangeCallbackValue = (0, react_1.useRef)(inputValue);
    // 触发 onInputValueChange 回调的原因
    var refOnInputChangeCallbackReason = (0, react_1.useRef)(null);
    var selectRef = (0, react_1.useRef)(null);
    // 暂存被选中的值对应的节点。仅在onSearch的时候用到
    // 避免出现下拉列表改变，之前选中的option找不到对应的节点，展示上会出问题。
    var stashNodes = (0, react_1.useRef)((store === null || store === void 0 ? void 0 : store.getCheckedNodes()) || []);
    // Unique ID of this instance
    var instancePopupID = (0, useId_1.default)(prefixCls + "-popup-");
    // 尝试更新 inputValue，触发 onInputValueChange
    var tryUpdateInputValue = function (value, reason) {
        if (value !== refOnInputChangeCallbackValue.current) {
            setInputValue(value);
            refOnInputChangeCallbackValue.current = value;
            refOnInputChangeCallbackReason.current = reason;
            props.onInputValueChange && props.onInputValueChange(value, reason);
        }
    };
    // 在 inputValue 变化时，适时触发 onSearch
    (0, react_1.useEffect)(function () {
        var reason = refOnInputChangeCallbackReason.current;
        if (stateInputValue === inputValue && (reason === 'manual' || reason === 'optionListHide')) {
            props.onSearch && props.onSearch(inputValue, reason);
        }
        if (inputValue !== refOnInputChangeCallbackValue.current) {
            refOnInputChangeCallbackValue.current = inputValue;
        }
    }, [inputValue]);
    (0, react_1.useEffect)(function () {
        var clearTimer = function () {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        };
        if (!popupVisible && inputValue) {
            if (timerRef.current) {
                clearTimer();
            }
            timerRef.current = setTimeout(function () {
                tryUpdateInputValue('', 'optionListHide');
                timerRef.current = null;
            }, 200);
        }
        return function () {
            clearTimer();
        };
    }, [popupVisible]);
    (0, useUpdate_1.default)(function () {
        if ('value' in props && props.value !== stateValue) {
            // don't to use formatValue(x, y, store)
            // we just need to get the value in a valid format, and update it to store nodes
            var newValue = (0, util_1.formatValue)(props.value, isMultiple);
            store.setNodeCheckedByValue(newValue);
            setValue(newValue);
        }
    }, [props.value, isMultiple]);
    (0, react_1.useImperativeHandle)(ref, function () { return selectRef.current; }, []);
    var updateStashNodes = function (nodes) {
        stashNodes.current = Array.from(new Set([].concat(nodes, stashNodes.current)));
    };
    var getSelectedOptionsByValue = function (values) {
        var result = [];
        var valuesSet = (0, util_1.transformValuesToSet)(values);
        var findValue = function (nodes) {
            nodes.some(function (node) {
                if ((0, util_1.valueInSet)(valuesSet, node.pathValue)) {
                    result.push(node.getPathNodes().map(function (x) { return x._data; }));
                    (0, util_1.removeValueFromSet)(valuesSet, node.pathValue);
                }
                if (!valuesSet.size) {
                    return true;
                }
            });
        };
        findValue(store.getCheckedNodes());
        if (valuesSet.size) {
            findValue(stashNodes.current);
        }
        return result;
    };
    var handleVisibleChange = (0, react_1.useCallback)(function (newVisible) {
        if (newVisible !== popupVisible) {
            props.onVisibleChange && props.onVisibleChange(newVisible);
            if (!('popupVisible' in props)) {
                setPopupVisible(newVisible);
            }
        }
    }, [props.onVisibleChange, popupVisible]);
    var renderText = (0, react_1.useCallback)(function (value) {
        var _a;
        // store 中不存在时，从stashNodes.current中找一下对应节点
        var options = getSelectedOptionsByValue([value])[0] || [];
        var text;
        var valueShow = (0, is_1.isArray)(value) ? value.map(function (x) { return String(x); }) : [];
        if (options.length) {
            valueShow = options.map(function (x) { return x.label; });
        }
        if ((0, is_1.isFunction)(renderFormat)) {
            text = renderFormat(valueShow);
        }
        else if (valueShow.every(function (v) { return (0, is_1.isString)(v); })) {
            text = valueShow.join(' / ');
        }
        else {
            text = valueShow.reduce(function (total, item, index) {
                return total.concat(index === 0 ? [item] : [' / ', item]);
            }, []);
        }
        return {
            text: text || '',
            disabled: (_a = options[options.length - 1]) === null || _a === void 0 ? void 0 : _a.disabled,
        };
    }, [store, renderFormat]);
    var handleChange = function (newValue, trigger) {
        var _a;
        if (trigger === 'panel' &&
            (0, is_1.isObject)(props.showSearch) &&
            !props.showSearch.retainInputValueWhileSelect &&
            isMultiple) {
            tryUpdateInputValue('', 'optionChecked');
        }
        var onChange = props.onChange, changeOnSelect = props.changeOnSelect, expandTrigger = props.expandTrigger;
        var isSame = mergeValue === newValue;
        if (isSame) {
            return;
        }
        if (!isMultiple) {
            store.setNodeCheckedByValue(newValue);
        }
        updateStashNodes(store.getCheckedNodes());
        var selectedOptions = getSelectedOptionsByValue(newValue);
        var _value = isMultiple ? newValue : newValue[0];
        var _selectedOptions = isMultiple ? selectedOptions : selectedOptions[0];
        if (!isMultiple) {
            if (inputValue) {
                // 单选时选择搜索项，直接关闭面板
                handleVisibleChange(false);
            }
            else if ((selectedOptions[0] && ((_a = selectedOptions[0][selectedOptions[0].length - 1]) === null || _a === void 0 ? void 0 : _a.isLeaf)) ||
                (changeOnSelect && expandTrigger === 'hover')) {
                handleVisibleChange(false);
            }
        }
        if ('value' in props) {
            store.setNodeCheckedByValue(mergeValue);
            // 受控触发更新，回到选中前的状态。
            forceUpdate();
        }
        else {
            setValue(newValue);
        }
        onChange &&
            onChange(_value, _selectedOptions, {
                dropdownVisible: popupVisible,
            });
    };
    var onRemoveCheckedItem = function (item, index, e) {
        e.stopPropagation();
        if (item.disabled) {
            return;
        }
        var newValue = mergeValue.filter(function (_, i) { return i !== index; });
        store.setNodeCheckedByValue(newValue);
        handleChange(newValue);
    };
    var renderEmptyEle = function (width) {
        var wd = width || (selectRef.current && selectRef.current.getWidth());
        return (react_1.default.createElement("div", { className: prefixCls + "-list-empty", style: { width: wd } }, props.notFoundContent || renderEmpty('Cascader')));
    };
    var renderPopup = function () {
        var _a;
        // 远程搜索时是否以搜索面板展示搜索结果
        var panelMode = (0, is_1.isObject)(props.showSearch) ? props.showSearch.panelMode : undefined;
        var showSearchPanel = panelMode === util_1.PANEL_MODE.select
            ? true
            : panelMode === util_1.PANEL_MODE.cascader
                ? false
                : !(0, is_1.isFunction)(props.onSearch) && !!inputValue;
        var width = selectRef.current && selectRef.current.getWidth();
        var dropdownRender = (0, is_1.isFunction)(props.dropdownRender) ? props.dropdownRender : function (menu) { return menu; };
        return (react_1.default.createElement("div", { id: instancePopupID, className: (0, classNames_1.default)(prefixCls + "-popup", props.dropdownMenuClassName, (_a = {},
                _a[prefixCls + "-popup-trigger-hover"] = props.expandTrigger === 'hover',
                _a)) }, dropdownRender(react_1.default.createElement("div", { className: prefixCls + "-popup-inner", onMouseDown: function (e) { return e.preventDefault(); } }, showSearchPanel ? (react_1.default.createElement(search_panel_1.default, { style: { minWidth: width }, store: store, inputValue: inputValue, renderEmpty: function () { return renderEmptyEle(width); }, multiple: isMultiple, onChange: function (value) {
                handleChange(value, 'panel');
            }, prefixCls: prefixCls, rtl: rtl, onEsc: function () {
                handleVisibleChange(false);
            }, renderOption: ((0, is_1.isObject)(props.showSearch) && props.showSearch.renderOption) || undefined, 
            // TODO 组件重构，解耦面板选择和输入框，面板可独立使用
            getTriggerElement: function () { var _a; return (_a = selectRef.current) === null || _a === void 0 ? void 0 : _a.dom; }, value: mergeValue, virtualListProps: props.virtualListProps, defaultActiveFirstOption: props.defaultActiveFirstOption, icons: iconsMap })) : (react_1.default.createElement(list_1.default, { dropdownMenuColumnStyle: props.dropdownMenuColumnStyle, virtualListProps: props.virtualListProps, expandTrigger: expandTrigger, store: store, dropdownColumnRender: props.dropdownColumnRender, renderOption: props.renderOption, changeOnSelect: props.changeOnSelect, showEmptyChildren: props.showEmptyChildren || !!props.loadMore, multiple: isMultiple, onChange: function (value) {
                handleChange(value, 'panel');
            }, loadMore: props.loadMore, prefixCls: prefixCls, rtl: rtl, getTriggerElement: function () { var _a; return (_a = selectRef.current) === null || _a === void 0 ? void 0 : _a.dom; }, renderEmpty: renderEmptyEle, popupVisible: popupVisible, value: mergeValue, renderFooter: props.renderFooter, icons: iconsMap, onEsc: function () {
                handleVisibleChange(false);
            }, onDoubleClickOption: function () {
                if (props.changeOnSelect && !isMultiple) {
                    handleVisibleChange(false);
                }
            } }))))));
    };
    var updateSelectedValues = function (value) {
        handleChange(value);
    };
    var renderView = function (eleView) {
        return (react_1.default.createElement(Trigger_1.default, __assign({ popup: renderPopup, trigger: props.trigger, disabled: disabled, getPopupContainer: getPopupContainer, position: rtl ? 'br' : 'bl', classNames: "slideDynamicOrigin", popupAlign: triggerPopupAlign, 
            // 动态加载时，unmountOnExit 默认为false。
            unmountOnExit: 'unmountOnExit' in props ? props.unmountOnExit : !(0, is_1.isFunction)(props.loadMore), popupVisible: popupVisible }, triggerProps, { onVisibleChange: handleVisibleChange }), eleView));
    };
    return children ? (renderView(children)) : (react_1.default.createElement(select_view_1.default, __assign({}, props, { ref: selectRef, ariaControls: instancePopupID, popupVisible: popupVisible, value: isMultiple ? mergeValue : mergeValue && mergeValue[0], inputValue: inputValue, rtl: rtl, 
        // other
        isEmptyValue: (0, util_1.isEmptyValue)(mergeValue), prefixCls: prefixCls, isMultiple: isMultiple, renderText: renderText, onRemoveCheckedItem: onRemoveCheckedItem, onSort: updateSelectedValues, renderView: renderView, onClear: function (e) {
            var _a;
            e.stopPropagation();
            if (!isMultiple) {
                handleChange([]);
            }
            else {
                var nodes = store.getCheckedNodes();
                var newValue = nodes.filter(function (x) { return x.disabled; }).map(function (x) { return x.pathValue; });
                store.setNodeCheckedByValue(newValue);
                handleChange(newValue);
            }
            (_a = props.onClear) === null || _a === void 0 ? void 0 : _a.call(props, !!popupVisible);
        }, onKeyDown: function (e) {
            var _a;
            if (disabled) {
                return;
            }
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            if (keyCode === keycode_1.Enter.code && !popupVisible) {
                handleVisibleChange(true);
                e.preventDefault();
            }
            if (keyCode === keycode_1.Tab.code && popupVisible) {
                handleVisibleChange(false);
            }
            (_a = props.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }, 
        // onFocus={this.onFocusInput}
        onChangeInputValue: function (v) {
            tryUpdateInputValue(v, 'manual');
            // tab键 focus 到输入框，此时下拉框未显示。如果输入值，展示下拉框
            if (!popupVisible) {
                handleVisibleChange(true);
            }
        } })));
}
var CascaderComponent = (0, react_1.forwardRef)(Cascader);
CascaderComponent.displayName = 'Cascader';
exports.default = CascaderComponent;
