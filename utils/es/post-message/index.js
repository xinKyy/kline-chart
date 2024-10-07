function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var IframeEventChannel = /*#__PURE__*/function () {
  function IframeEventChannel(props) {
    var _this = this;
    _classCallCheck(this, IframeEventChannel);
    this.subscribers = {};
    window.addEventListener(props, function (data) {
      _this.publish(props, data);
    });
  }
  _createClass(IframeEventChannel, [{
    key: "subscribe",
    value:
    // 订阅事件
    function subscribe(eventName, callback) {
      if (!this.subscribers[eventName]) {
        this.subscribers[eventName] = [];
      }
      this.subscribers[eventName].push(callback);
    }
    // 发布事件
  }, {
    key: "publish",
    value: function publish(eventName, data) {
      if (this.subscribers[eventName]) {
        this.subscribers[eventName].forEach(function (callback) {
          callback(data);
        });
      }
    }
    // 发送数据给子 iframe
  }, {
    key: "send",
    value: function send(dom, data, url) {
      var _a;
      var iframe = dom === null || dom === void 0 ? void 0 : dom.current;
      iframe && ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(data, url || '*'));
    }
    // 子 iframe 接收数据
  }, {
    key: "receive",
    value: function receive(fun) {
      this.subscribe('message', fun);
    }
    // 子 iframe 发送数据
  }, {
    key: "emit",
    value: function emit(data, url) {
      var _a;
      (_a = window.parent) === null || _a === void 0 ? void 0 : _a.postMessage(data, url || '*');
    }
    // 接收子 iframe 发送的数据
  }, {
    key: "on",
    value: function on(fun) {
      this.subscribe('message', fun);
    }
    // 添加销毁方法，取消事件监听和订阅
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;
      window.removeEventListener('message', function () {
        _this2.subscribers = {};
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!this.instance) {
        this.instance = new IframeEventChannel('message');
      }
      return this.instance;
    }
  }]);
  return IframeEventChannel;
}();
var CommandsEnum;
(function (CommandsEnum) {
  CommandsEnum["jumpToLogin"] = "jumpToLogin";
  CommandsEnum["jumpToHome"] = "jumpToHome";
  CommandsEnum["start"] = "start";
  CommandsEnum["switch"] = "switch";
  CommandsEnum["web"] = "recreation-web";
  CommandsEnum["h5"] = "recreation-h5";
})(CommandsEnum || (CommandsEnum = {}));
/** 公告跑马灯路由挑战 */
var HourseLampEnum;
(function (HourseLampEnum) {
  HourseLampEnum["main"] = "announcement";
  HourseLampEnum["article"] = "announcementArticle";
})(HourseLampEnum || (HourseLampEnum = {}));
export { CommandsEnum, HourseLampEnum, IframeEventChannel as default };
