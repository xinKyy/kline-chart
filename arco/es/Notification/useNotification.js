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
import React, { createRef } from 'react';
import ContextHolderElement from '../_util/contextHolder';
import Notification from '.';
import { isUndefined } from '../_util/is';
function useNotification(commonConfig) {
    if (commonConfig === void 0) { commonConfig = {}; }
    var maxCount = commonConfig.maxCount, _a = commonConfig.duration, duration = _a === void 0 ? 3000 : _a, _prefixCls = commonConfig.prefixCls, getContainer = commonConfig.getContainer;
    var contextHolderRef = createRef();
    var holderEle = React.createElement(ContextHolderElement, { ref: contextHolderRef });
    var notificationInstance = {};
    var notice;
    function addNotice(noticeProps) {
        var prefixCls, rtl;
        if (contextHolderRef.current) {
            var contextConfig = contextHolderRef.current.getContextConfig();
            rtl = contextConfig.rtl;
            prefixCls = contextConfig.prefixCls;
        }
        var mergedPrefixCls = _prefixCls || prefixCls;
        var position = noticeProps.position;
        if (isUndefined(noticeProps.position)) {
            position = rtl ? 'topLeft' : 'topRight';
        }
        var _noticeProps = __assign({ duration: duration }, noticeProps);
        var id;
        if (notificationInstance[position]) {
            var notices = notificationInstance[position].state.notices;
            if (notices.length >= maxCount) {
                var updated = notices[0];
                id = updated.id;
                notices.shift();
                notificationInstance[position].add(__assign(__assign({}, _noticeProps), { id: id }));
            }
            else {
                id = notificationInstance[position].add(_noticeProps);
            }
        }
        else {
            notice = (React.createElement(Notification, { ref: function (instance) {
                    notificationInstance[position] = instance;
                    if (notificationInstance[position]) {
                        id = notificationInstance[position].add(_noticeProps);
                    }
                }, prefixCls: mergedPrefixCls, rtl: rtl, getContainer: getContainer }));
            contextHolderRef.current.addInstance(notice);
        }
        return notificationInstance[position];
    }
    var notificationFuncs = {};
    ['info', 'success', 'warning', 'error', 'normal'].forEach(function (type) {
        notificationFuncs[type] = function (config) {
            return addNotice(__assign(__assign({}, config), { type: type }));
        };
    });
    return [notificationFuncs, holderEle];
}
export default useNotification;
