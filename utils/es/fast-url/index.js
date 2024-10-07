function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
import { MerchantID, MerchantIDEnum } from '../env/index.js';

/**
 * 判断是否是 S3、OSS 然后把地址替换成高速通道 URL
 */
function getFastUrl(url) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MerchantIDEnum.common;
  if (typeof url !== 'string') {
    console.log(url, 'getFastUrl: 请检查下传入的 URL 不为字符串');
    return url;
  }
  var _ref = MerchantID[id] || MerchantID[MerchantIDEnum.common],
    originS3Domain = _ref.originS3Domain,
    fastS3Domain = _ref.fastS3Domain,
    fastS3DomainOld = _ref.fastS3DomainOld,
    originOSSDomain = _ref.originOSSDomain,
    fastOSSDomain = _ref.fastOSSDomain,
    originOSSDomainOld = _ref.originOSSDomainOld,
    fastOSSDomainOld = _ref.fastOSSDomainOld,
    originProdS3Domain = _ref.originProdS3Domain,
    fastProdS3Domain = _ref.fastProdS3Domain,
    originTestS3Domain = _ref.originTestS3Domain,
    fastTestS3Domain = _ref.fastTestS3Domain,
    originDevS3Domain = _ref.originDevS3Domain,
    fastDevS3Domain = _ref.fastDevS3Domain,
    originDevS3ProdUploadDomain = _ref.originDevS3ProdUploadDomain,
    fastDevS3ProdUploadDomain = _ref.fastDevS3ProdUploadDomain,
    originDevS3DevUploadDomain = _ref.originDevS3DevUploadDomain,
    fastDevS3DevUploadDomain = _ref.fastDevS3DevUploadDomain;
  /** oss 和 s3 匹配处理，主要处理静态资源 */
  if (url.includes(originS3Domain)) {
    // 执行替换操作
    url = url === null || url === void 0 ? void 0 : url.replace(originS3Domain, fastS3Domain);
    return url;
  }
  if (url.includes(fastS3DomainOld)) {
    // 执行替换操作
    url = url === null || url === void 0 ? void 0 : url.replace(fastS3DomainOld, fastS3Domain);
    return url;
  }
  if (url.includes(originOSSDomain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originOSSDomain, fastOSSDomain);
    return url;
  }
  if (url.includes(originOSSDomainOld)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originOSSDomainOld, fastOSSDomainOld);
    return url;
  }
  // s3 不同环境的匹配，主要处理 s3 json 文件
  if (url.includes(originProdS3Domain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originProdS3Domain, fastProdS3Domain);
    return url;
  }
  if (url.includes(originTestS3Domain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originTestS3Domain, fastTestS3Domain);
    return url;
  }
  if (url.includes(originDevS3Domain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originDevS3Domain, fastDevS3Domain);
    return url;
  }
  // upload 替换
  if (url.includes(originDevS3ProdUploadDomain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originDevS3ProdUploadDomain, fastDevS3ProdUploadDomain);
    return url;
  }
  if (url.includes(originDevS3DevUploadDomain)) {
    url = url === null || url === void 0 ? void 0 : url.replace(originDevS3DevUploadDomain, fastDevS3DevUploadDomain);
    return url;
  }
  return url;
}
/**
 * 给 url 地址添加当天零点的时间戳以便于刷新缓存
 */
function getUrlWithTimestamp(url) {
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  var timestamp = date.getTime();
  if (typeof url !== 'string') {
    console.log(url, 'getUrlWithTimestamp: 请检查下传入的 URL 不为字符串');
    return url;
  }
  // 没有后缀的情况下不添加时间戳
  if (!getFileType(url)) {
    return url;
  }
  return url.includes('?') ? "".concat(url, "&t=").concat(timestamp) : "".concat(url, "?t=").concat(timestamp);
}
function hasSingleChars(str, currentStr) {
  var charMap = {};
  var result = false;
  var _iterator = _createForOfIteratorHelper(str),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _char = _step.value;
      if (currentStr === _char) {
        if (charMap[_char]) {
          result = false;
        }
        charMap[_char] = true;
        result = true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}
function getFileType(url) {
  if (typeof url !== 'string') {
    console.log(url, 'getFileType: 请检查下传入的 URL 不为字符串');
    return '';
  }
  url = url.split('?')[0] || '';
  var allNames = url.split('/') || [];
  var nameArr = allNames.slice(3, allNames.length);
  var hasTypeStr = '';
  nameArr.forEach(function (v) {
    if (hasSingleChars(v, '.')) {
      hasTypeStr = v;
    }
  });
  return hasTypeStr.split('.')[1];
}
function injectThemeImgUrl(url, theme) {
  if (typeof url !== 'string') {
    console.log(url, 'injectThemeImgUrl: 请检查下传入的 URL 不为字符串');
    return url;
  }
  var allNames = url.split('/') || [];
  var nameArr = allNames.slice(3, allNames.length);
  var strHasType = '';
  nameArr.forEach(function (v) {
    if (hasSingleChars(v, '.')) {
      strHasType = v;
    }
  });
  if (strHasType) {
    var _strHasType$split = strHasType.split('.'),
      _strHasType$split2 = _slicedToArray(_strHasType$split, 2),
      name = _strHasType$split2[0],
      type = _strHasType$split2[1];
    return url.replace(strHasType, "".concat(name).concat(theme, ".").concat(type));
  }
  return "".concat(url).concat(theme);
}
/**
 * url 传进来的地址
 * whetherManyBusiness: 是否是多商户模式图片
 * businessId: 商户 id
 */
function getFastManyBusinessUrl(url, whetherManyBusiness, businessId) {
  /** 是否是多商户模式图片，如果是就会替换想换路径 * */
  if (whetherManyBusiness) {
    url = url.replace('/h5/image/', "/h5/business/".concat(businessId, "/business-img/"));
  }
  return url;
}
export { getFastManyBusinessUrl, getFastUrl, getFileType, getUrlWithTimestamp, injectThemeImgUrl };
