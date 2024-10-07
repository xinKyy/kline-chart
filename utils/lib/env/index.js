'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('../config/common.js');
var im = require('../config/im.js');
var vpn = require('../config/vpn.js');
var index$1 = require('../fast-url/index.js');

// 命名空间
const Namespaces = {
    getwayBaseUrl: common.getwayBaseUrl,
    uatServerBaseUrl: common.uatServerBaseUrl,
    commonServerBaseUrl: common.commonServerBaseUrl,
    getBaseServerUrl: common.getBaseServerUrl, // 根据 bid 拼接命名空间地址
};
// 环境标识枚举
exports.MerchantIDEnum = void 0;
(function (MerchantIDEnum) {
    MerchantIDEnum["common"] = "common";
    MerchantIDEnum["uat"] = "uat";
    MerchantIDEnum["im"] = "im";
    MerchantIDEnum["vpn"] = "vpn"; // vpn 环境
})(exports.MerchantIDEnum || (exports.MerchantIDEnum = {}));
// 商户对象
const MerchantID = {
    [exports.MerchantIDEnum.common]: common.s3CommonConfig,
    [exports.MerchantIDEnum.uat]: common.s3UatConfig,
    [exports.MerchantIDEnum.im]: im.s3ImConfig,
    [exports.MerchantIDEnum.vpn]: vpn.s3VpnConfig,
};
// 环境枚举
exports.EnvTypesEnum = void 0;
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
})(exports.EnvTypesEnum || (exports.EnvTypesEnum = {}));
/**
 * Nodejs 环境变量映射到实际业务的环境变量简称
 */
const EnvTypesMap = {
    [exports.EnvTypesEnum.development]: 'staging',
    [exports.EnvTypesEnum.dev]: 'dev',
    [exports.EnvTypesEnum.test]: 'staging',
    [exports.EnvTypesEnum.stress]: 'stress',
    [exports.EnvTypesEnum.production]: 'prod',
};
/** S3 配置文件名枚举 */
exports.S3UrlNameEnum = void 0;
(function (S3UrlNameEnum) {
    /** dns 配置文件名 */
    S3UrlNameEnum["dnsConfig"] = "_dnsConfig.json";
    /** 动态化配置文件名 */
    S3UrlNameEnum["moduleAuthConfig"] = "_mainFuncStatus.json";
})(exports.S3UrlNameEnum || (exports.S3UrlNameEnum = {}));
/**
 * 获取 S3 域名配置信息
 */
const getBaseEnvS3Url = (mode, type, id = exports.MerchantIDEnum.common) => {
    const rootUrl = MerchantID[id];
    let fastDomain = '';
    switch (mode) {
        case exports.EnvTypesEnum.production:
            fastDomain = rootUrl.fastProdS3Domain;
            break;
        case exports.EnvTypesEnum.dev:
            fastDomain = rootUrl.fastDevS3Domain;
            break;
        case exports.EnvTypesEnum.test:
            fastDomain = rootUrl.fastTestS3Domain;
            break;
        default:
            fastDomain = rootUrl.fastTestS3Domain;
            break;
    }
    return `${fastDomain}/${type}`;
};
/**
 * 获取 S3 域名配置信息
 */
const getEnvS3Url = (mode, businessId, urlName = exports.S3UrlNameEnum.dnsConfig, id = exports.MerchantIDEnum.common) => {
    return getBaseEnvS3Url(mode, `${businessId}${urlName}`, id);
};
/**
 * 获取 S3 秘钥信息
 */
const getEnvSecretS3KeyConfig = (mode, accessKey, id = exports.MerchantIDEnum.common) => {
    return getBaseEnvS3Url(mode, `${accessKey}.json`, id);
};
/**
 * 获取融合模式秘钥信息
 */
const getMergeModeEnvSecretS3KeyConfig = (mode, accessKey, id = exports.MerchantIDEnum.common) => {
    const rootUrl = MerchantID[id];
    let fastDomain = '';
    switch (mode) {
        case exports.EnvTypesEnum.production:
            fastDomain = rootUrl.mergeModeS3ProdDomain;
            break;
        case exports.EnvTypesEnum.dev:
            fastDomain = rootUrl.mergeModeS3DevDomain;
            break;
        case exports.EnvTypesEnum.test:
            fastDomain = rootUrl.mergeModeS3TestDomain;
            break;
        default:
            fastDomain = rootUrl.mergeModeS3TestDomain;
            break;
    }
    return `${fastDomain}/${accessKey}.json`;
};
/**
 * AWS S3 对象存储配置，上传需要的 config
 */
function getEnvAwsS3Config(mode) {
    /** 基础桶信息 */
    const baseInfo = {
        region: 'ap-southeast-1',
        accessKeyId: 'AKIAW3MEEIZRRBT7AS4J',
        secretAccessKey: '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',
    };
    /** 生产桶信息 */
    const baseInfoProd = Object.assign({ bucket: 'saas-s3-prod' }, baseInfo);
    /** 测试桶信息 */
    const baseInfoStaging = Object.assign({ bucket: 'saas-s3-staging' }, baseInfo);
    /** 开发桶信息 */
    const baseInfoDev = Object.assign({ bucket: 'nb-sg-dev-saas-515' }, baseInfo);
    switch (mode) {
        case exports.EnvTypesEnum.production:
            return baseInfoProd;
        case exports.EnvTypesEnum.test:
            return baseInfoStaging;
        case exports.EnvTypesEnum.dev:
            return baseInfoDev;
        default:
            return baseInfoStaging;
    }
}
/**
 * 获取系统维护相关信息
 */
const getEnvS3MaintenanceApiUrl = (mode, businessId, id = exports.MerchantIDEnum.common) => {
    switch (mode) {
        case exports.EnvTypesEnum.production:
            return index$1.getFastUrl(`${MerchantID[id].fastProdS3Domain}/${businessId}_maintenanceConfig.json`, id);
        case exports.EnvTypesEnum.dev:
            return index$1.getFastUrl(`${MerchantID[id].fastDevS3Domain}/${businessId}_maintenanceConfig.json`, id);
        case exports.EnvTypesEnum.test:
            return index$1.getFastUrl(`${MerchantID[id].fastTestS3Domain}/${businessId}_maintenanceConfig.json`, id);
        default:
            return index$1.getFastUrl(`${MerchantID[id].fastTestS3Domain}/${businessId}_maintenanceConfig.json`, id);
    }
};

exports.EnvTypesMap = EnvTypesMap;
exports.MerchantID = MerchantID;
exports.Namespaces = Namespaces;
exports.getBaseEnvS3Url = getBaseEnvS3Url;
exports.getEnvAwsS3Config = getEnvAwsS3Config;
exports.getEnvS3MaintenanceApiUrl = getEnvS3MaintenanceApiUrl;
exports.getEnvS3Url = getEnvS3Url;
exports.getEnvSecretS3KeyConfig = getEnvSecretS3KeyConfig;
exports.getMergeModeEnvSecretS3KeyConfig = getMergeModeEnvSecretS3KeyConfig;
