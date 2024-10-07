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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useControlBlock = void 0;
var react_1 = require("react");
var useControlBlock = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    var _b = __read((0, react_1.useState)(false), 2), active = _b[0], setActive = _b[1];
    var blockRef = (0, react_1.useRef)();
    var handlerRef = (0, react_1.useRef)();
    var getPercentNumber = function (value, max) {
        if (value < 0) {
            return 0;
        }
        if (value > max) {
            return 1;
        }
        return value / max;
    };
    var setCurrentPosition = function (ev) {
        var clientX = ev.clientX, clientY = ev.clientY;
        var rect = blockRef.current.getBoundingClientRect();
        var newValue = [
            getPercentNumber(clientX - rect.x, rect.width),
            getPercentNumber(clientY - rect.y, rect.height),
        ];
        if (newValue[0] !== value[0] || newValue[1] !== value[1]) {
            onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        }
    };
    var removeListener = function () {
        setActive(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', removeListener);
        window.removeEventListener('contextmenu', removeListener);
    };
    var onMouseDown = function (ev) {
        setActive(true);
        setCurrentPosition(ev);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', removeListener);
        window.addEventListener('contextmenu', removeListener);
    };
    function onMouseMove(ev) {
        ev.preventDefault();
        if (ev.buttons > 0) {
            setCurrentPosition(ev);
        }
        else {
            removeListener();
        }
    }
    return {
        active: active,
        blockRef: blockRef,
        handlerRef: handlerRef,
        onMouseDown: onMouseDown,
    };
};
exports.useControlBlock = useControlBlock;
