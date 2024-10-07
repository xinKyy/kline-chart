"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
var react_dom_1 = __importDefault(require("react-dom"));
var is_1 = require("./is");
var __SECRET_INTERNALS__ = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
var CopyReactDOM = react_dom_1.default;
var copyRender;
var isReact18 = Number((_a = CopyReactDOM.version) === null || _a === void 0 ? void 0 : _a.split('.')[0]) > 17;
var updateUsingClientEntryPoint = function (skipWarning) {
    // https://github.com/facebook/react/blob/17806594cc28284fe195f918e8d77de3516848ec/packages/react-dom/npm/client.js#L10
    // Avoid console warning
    if ((0, is_1.isObject)(CopyReactDOM[__SECRET_INTERNALS__])) {
        CopyReactDOM[__SECRET_INTERNALS__].usingClientEntryPoint = skipWarning;
    }
};
var createRoot;
try {
    createRoot = CopyReactDOM.createRoot;
}
catch (_) {
    //
}
if (isReact18 && createRoot) {
    copyRender = function (app, container) {
        updateUsingClientEntryPoint(true);
        var root = createRoot(container);
        updateUsingClientEntryPoint(false);
        root.render(app);
        root._unmount = function () {
            setTimeout(function () {
                var _a;
                (_a = root === null || root === void 0 ? void 0 : root.unmount) === null || _a === void 0 ? void 0 : _a.call(root);
            });
        };
        return root;
    };
}
else {
    copyRender = function (app, container) {
        CopyReactDOM.render(app, container);
        return {
            render: function (app) {
                CopyReactDOM.render(app, container);
            },
            _unmount: function () {
                CopyReactDOM.unmountComponentAtNode(container);
            },
        };
    };
}
exports.render = copyRender;
