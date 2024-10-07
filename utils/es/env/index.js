var _MerchantID, _EnvTypesMap;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { s3CommonConfig, s3UatConfig, getwayBaseUrl, uatServerBaseUrl, commonServerBaseUrl, getBaseServerUrl } from '../config/common.js';
import { s3ImConfig } from '../config/im.js';
import { s3VpnConfig } from '../config/vpn.js';
import { getFastUrl } from '../fast-url/index.js';

// 命名空间
var Namespaces = {
  getwayBaseUrl: getwayBaseUrl,
  uatServerBaseUrl: uatServerBaseUrl,
  commonServerBaseUrl: commonServerBaseUrl,
  getBaseServerUrl: getBaseServerUrl // 根据 bid 拼接命名空间地址
};
// 环境标识枚举
var MerchantIDEnum;
(function (MerchantIDEnum) {
  MerchantIDEnum["common"] = "common";
  MerchantIDEnum["uat"] = "uat";
  MerchantIDEnum["im"] = "im";
  MerchantIDEnum["vpn"] = "vpn"; // vpn 环境
})(MerchantIDEnum || (MerchantIDEnum = {}));
// 商户对象
var MerchantID = (_MerchantID = {}, _defineProperty(_MerchantID, MerchantIDEnum.common, s3CommonConfig), _defineProperty(_MerchantID, MerchantIDEnum.uat, s3UatConfig), _defineProperty(_MerchantID, MerchantIDEnum.im, s3ImConfig), _defineProperty(_MerchantID, MerchantIDEnum.vpn, s3VpnConfig), _MerchantID);
// 环境枚举
var EnvTypesEnum;
(function (EnvTypesEnum) {
  // 本地环境
  EnvTypesEnum["development"] = "development";
  // sg 开发环境
  EnvTypesEnum["dev"] = "dev";
  // 测试环境
  EnvTypesEnum["test"] = "test";
  // 压测环境
  EnvTypesEnum["stress"] = "stress";
  // 生产环境
  EnvTypesEnum["production"] = "production";
})(EnvTypesEnum || (EnvTypesEnum = {}));
/**
 * Nodejs 环境变量映射到实际业务的环境变量简称
 */
var EnvTypesMap = (_EnvTypesMap = {}, _defineProperty(_EnvTypesMap, EnvTypesEnum.development, 'staging'), _defineProperty(_EnvTypesMap, EnvTypesEnum.dev, 'dev'), _defineProperty(_EnvTypesMap, EnvTypesEnum.test, 'staging'), _defineProperty(_EnvTypesMap, EnvTypesEnum.stress, 'stress'), _defineProperty(_EnvTypesMap, EnvTypesEnum.production, 'prod'), _EnvTypesMap);
/** S3 配置文件名枚举 */
var S3UrlNameEnum;
(function (S3UrlNameEnum) {
  /** dns 配置文件名 */
  S3UrlNameEnum["dnsConfig"] = "_dnsConfig.json";
  /** 动态化配置文件名 */
  S3UrlNameEnum["moduleAuthConfig"] = "_mainFuncStatus.json";
})(S3UrlNameEnum || (S3UrlNameEnum = {}));
/**
 * 获取 S3 域名配置信息
 */
var getBaseEnvS3Url = function getBaseEnvS3Url(mode, type) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MerchantIDEnum.common;
  var rootUrl = MerchantID[id];
  var fastDomain = '';
  switch (mode) {
    case EnvTypesEnum.production:
      fastDomain = rootUrl.fastProdS3Domain;
      break;
    case EnvTypesEnum.dev:
      fastDomain = rootUrl.fastDevS3Domain;
      break;
    case EnvTypesEnum.test:
      fastDomain = rootUrl.fastTestS3Domain;
      break;
    default:
      fastDomain = rootUrl.fastTestS3Domain;
      break;
  }
  return "".concat(fastDomain, "/").concat(type);
};
/**
 * 获取 S3 域名配置信息
 */
var getEnvS3Url = function getEnvS3Url(mode, businessId) {
  var urlName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : S3UrlNameEnum.dnsConfig;
  var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MerchantIDEnum.common;
  return getBaseEnvS3Url(mode, "".concat(businessId).concat(urlName), id);
};
/**
 * 获取 S3 秘钥信息
 */
var getEnvSecretS3KeyConfig = function getEnvSecretS3KeyConfig(mode, accessKey) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MerchantIDEnum.common;
  return getBaseEnvS3Url(mode, "".concat(accessKey, ".json"), id);
};
/**
 * 获取融合模式秘钥信息
 */
var getMergeModeEnvSecretS3KeyConfig = function getMergeModeEnvSecretS3KeyConfig(mode, accessKey) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MerchantIDEnum.common;
  var rootUrl = MerchantID[id];
  var fastDomain = '';
  switch (mode) {
    case EnvTypesEnum.production:
      fastDomain = rootUrl.mergeModeS3ProdDomain;
      break;
    case EnvTypesEnum.dev:
      fastDomain = rootUrl.mergeModeS3DevDomain;
      break;
    case EnvTypesEnum.test:
      fastDomain = rootUrl.mergeModeS3TestDomain;
      break;
    default:
      fastDomain = rootUrl.mergeModeS3TestDomain;
      break;
  }
  return "".concat(fastDomain, "/").concat(accessKey, ".json");
};
/**
 * AWS S3 对象存储配置，上传需要的 config
 */
function getEnvAwsS3Config(mode) {
  /** 基础桶信息 */
  var baseInfo = {
    region: 'ap-southeast-1',
    accessKeyId: 'AKIAW3MEEIZRRBT7AS4J',
    secretAccessKey: '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'
  };
  /** 生产桶信息 */
  var baseInfoProd = Object.assign({
    bucket: 'saas-s3-prod'
  }, baseInfo);
  /** 测试桶信息 */
  var baseInfoStaging = Object.assign({
    bucket: 'saas-s3-staging'
  }, baseInfo);
  /** 开发桶信息 */
  var baseInfoDev = Object.assign({
    bucket: 'nb-sg-dev-saas-515'
  }, baseInfo);
  switch (mode) {
    case EnvTypesEnum.production:
      return baseInfoProd;
    case EnvTypesEnum.test:
      return baseInfoStaging;
    case EnvTypesEnum.dev:
      return baseInfoDev;
    default:
      return baseInfoStaging;
  }
}
/**
 * 获取系统维护相关信息
 */
var getEnvS3MaintenanceApiUrl = function getEnvS3MaintenanceApiUrl(mode, businessId) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MerchantIDEnum.common;
  switch (mode) {
    case EnvTypesEnum.production:
      return getFastUrl("".concat(MerchantID[id].fastProdS3Domain, "/").concat(businessId, "_maintenanceConfig.json"), id);
    case EnvTypesEnum.dev:
      return getFastUrl("".concat(MerchantID[id].fastDevS3Domain, "/").concat(businessId, "_maintenanceConfig.json"), id);
    case EnvTypesEnum.test:
      return getFastUrl("".concat(MerchantID[id].fastTestS3Domain, "/").concat(businessId, "_maintenanceConfig.json"), id);
    default:
      return getFastUrl("".concat(MerchantID[id].fastTestS3Domain, "/").concat(businessId, "_maintenanceConfig.json"), id);
  }
};
export { EnvTypesEnum, EnvTypesMap, MerchantID, MerchantIDEnum, Namespaces, S3UrlNameEnum, getBaseEnvS3Url, getEnvAwsS3Config, getEnvS3MaintenanceApiUrl, getEnvS3Url, getEnvSecretS3KeyConfig, getMergeModeEnvSecretS3KeyConfig };
