'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class IframeEventChannel {
    constructor(props) {
        this.subscribers = {};
        window.addEventListener(props, (data) => {
            this.publish(props, data);
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IframeEventChannel('message');
        }
        return this.instance;
    }
    // 订阅事件
    subscribe(eventName, callback) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        this.subscribers[eventName].push(callback);
    }
    // 发布事件
    publish(eventName, data) {
        if (this.subscribers[eventName]) {
            this.subscribers[eventName].forEach(callback => {
                callback(data);
            });
        }
    }
    // 发送数据给子 iframe
    send(dom, data, url) {
        var _a;
        const iframe = dom === null || dom === void 0 ? void 0 : dom.current;
        iframe && ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(data, url || '*'));
    }
    // 子 iframe 接收数据
    receive(fun) {
        this.subscribe('message', fun);
    }
    // 子 iframe 发送数据
    emit(data, url) {
        var _a;
        (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage(data, url || '*');
    }
    // 接收子 iframe 发送的数据
    on(fun) {
        this.subscribe('message', fun);
    }
    // 添加销毁方法，取消事件监听和订阅
    destroy() {
        window.removeEventListener('message', () => {
            this.subscribers = {};
        });
    }
}
exports.CommandsEnum = void 0;
(function (CommandsEnum) {
    CommandsEnum["jumpToLogin"] = "jumpToLogin";
    CommandsEnum["jumpToHome"] = "jumpToHome";
    CommandsEnum["start"] = "start";
    CommandsEnum["switch"] = "switch";
    CommandsEnum["web"] = "recreation-web";
    CommandsEnum["h5"] = "recreation-h5";
})(exports.CommandsEnum || (exports.CommandsEnum = {}));
/** 公告跑马灯路由挑战 */
exports.HourseLampEnum = void 0;
(function (HourseLampEnum) {
    HourseLampEnum["main"] = "announcement";
    HourseLampEnum["article"] = "announcementArticle";
})(exports.HourseLampEnum || (exports.HourseLampEnum = {}));

exports["default"] = IframeEventChannel;
