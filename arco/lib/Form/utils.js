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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ID_SUFFIX = exports.isFieldMatch = exports.schemaValidate = exports.isSyntheticEvent = exports.iterativelyGetKeys = exports.set = exports.formatValidateMsg = exports.cloneDeep = void 0;
var cloneDeepWith_1 = __importDefault(require("lodash/cloneDeepWith"));
var set_1 = __importDefault(require("lodash/set"));
var b_validate_1 = require("b-validate");
var react_1 = __importDefault(require("react"));
var has_1 = __importDefault(require("lodash/has"));
var setWith_1 = __importDefault(require("lodash/setWith"));
var is_1 = require("../_util/is");
function cloneDeep(value) {
    // 只有对象才执行拷贝，否则直接返回。 如果是 File，MouseEvent对象，都可以直接返回
    return (0, cloneDeepWith_1.default)(value, function (val) {
        if (!(0, is_1.isObject)(val) && !(0, is_1.isArray)(val)) {
            return val;
        }
    });
}
exports.cloneDeep = cloneDeep;
var formatValidateMsg = function (validateMessages, info) {
    return (0, cloneDeepWith_1.default)(validateMessages, function (val) {
        if ((0, is_1.isFunction)(val)) {
            return function (data) {
                return val(data, info);
            };
        }
    });
};
exports.formatValidateMsg = formatValidateMsg;
function set(target, field, value) {
    (0, set_1.default)(target, field, cloneDeep(value));
    return target;
}
exports.set = set;
// iteratively get all keys of object including nested objects
// e.g. const myObj = { a: { b: { c: [1,2] } } }
// iterativelyGetKeys(myObj) returns ['a.b.c.0', 'a.b.c.1']
// reference https://stackoverflow.com/a/47063174
function iterativelyGetKeys(_obj, _prefix) {
    if (_prefix === void 0) { _prefix = ''; }
    var processed = new Set();
    var getKeys = function (obj, prefix) {
        if (prefix === void 0) { prefix = ''; }
        if (!obj) {
            return [];
        }
        // Avoid circular dependencies
        if (processed.has(obj)) {
            return [];
        }
        processed.add(obj);
        return Object.keys(obj)
            .map(function (el) {
            if (((0, is_1.isObject)(obj[el]) || (0, is_1.isArray)(obj[el])) &&
                Object.keys(obj[el]).length &&
                !react_1.default.isValidElement(obj[el])) {
                return getKeys(obj[el], prefix + el + ".");
            }
            return prefix + el;
        })
            .flat();
    };
    return getKeys(_obj, _prefix);
}
exports.iterativelyGetKeys = iterativelyGetKeys;
// 判断是否是个事件对象 e?.constructor?.name 可能不是 SyntheticEvent，跟业务项目的打包方式有关系
function isSyntheticEvent(e) {
    var _a;
    return ((_a = e === null || e === void 0 ? void 0 : e.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'SyntheticEvent' || (e === null || e === void 0 ? void 0 : e.nativeEvent) instanceof Event;
}
exports.isSyntheticEvent = isSyntheticEvent;
function schemaValidate(field, value, _rules, validateMessages) {
    return __awaiter(this, void 0, void 0, function () {
        var rules, current;
        var _this = this;
        return __generator(this, function (_a) {
            rules = __spreadArray([], __read((_rules || [])), false);
            current = 0;
            return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var warning, validate;
                    var _this = this;
                    return __generator(this, function (_a) {
                        warning = [];
                        validate = function (rule) { return __awaiter(_this, void 0, void 0, function () {
                            var next, _rule, schema;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                next = function () {
                                    if (current < rules.length - 1) {
                                        current++;
                                        return validate(rules[current]);
                                    }
                                    return resolve({ error: null, warning: warning });
                                };
                                if (!rule) {
                                    return [2 /*return*/, next()];
                                }
                                _rule = __assign({}, rule);
                                if (!_rule.type && !_rule.validator) {
                                    _rule.type = 'string';
                                }
                                schema = new b_validate_1.Schema((_a = {}, _a[field] = [_rule], _a), {
                                    ignoreEmptyString: true,
                                    validateMessages: validateMessages,
                                });
                                schema.validate((_b = {}, _b[field] = value, _b), function (error) {
                                    if (error) {
                                        if (rule.validateLevel === 'warning') {
                                            warning.push(error[field].message);
                                        }
                                        else {
                                            return resolve({
                                                error: error,
                                                warning: warning,
                                            });
                                        }
                                    }
                                    return next();
                                });
                                return [2 /*return*/];
                            });
                        }); };
                        validate(rules[current]);
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.schemaValidate = schemaValidate;
function isFieldMatch(field, fields) {
    var fieldObj = (0, setWith_1.default)({}, field, undefined, Object);
    return fields.some(function (item) { return (0, has_1.default)(fieldObj, item); });
}
exports.isFieldMatch = isFieldMatch;
exports.ID_SUFFIX = '_input';
