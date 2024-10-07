var _a;
import ReactDOM from 'react-dom';
import { isObject } from './is';
var __SECRET_INTERNALS__ = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
var CopyReactDOM = ReactDOM;
var copyRender;
var isReact18 = Number((_a = CopyReactDOM.version) === null || _a === void 0 ? void 0 : _a.split('.')[0]) > 17;
var updateUsingClientEntryPoint = function (skipWarning) {
    // https://github.com/facebook/react/blob/17806594cc28284fe195f918e8d77de3516848ec/packages/react-dom/npm/client.js#L10
    // Avoid console warning
    if (isObject(CopyReactDOM[__SECRET_INTERNALS__])) {
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
export var render = copyRender;
