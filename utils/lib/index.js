'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./decimal/index.js');
var index$1 = require('./market/index.js');
var index$2 = require('./fast-url/index.js');
var index$3 = require('./security/index.js');
var index$4 = require('./env/index.js');
var index$5 = require('./vite-plugins/index.js');
var index$6 = require('./post-message/index.js');

/** 调整默认精度位：运算结果的最大有效位数 */
index.setPrecision(40);

exports.decimalUtils = index;
exports.marketUtils = index$1;
exports.fastUrlUtils = index$2;
exports.securityUtils = index$3;
exports.envUtils = index$4;
exports.vitePlugins = index$5;
exports.postMessage = index$6;
