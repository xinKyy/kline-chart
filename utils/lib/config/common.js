'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 通用网关地址
const getwayBaseUrl = 'http://gateway:8080';
// nc bff
const uatServerBaseUrl = 'http://bff-330056:4100/api/forward/';
// 根据 bid 拼接 bff 地址
const getBaseServerUrl = (bid) => {
    return `http://bff-${bid}:4100/api/forward/`;
};
// 通用 bff 命名空间地址
const commonServerBaseUrl = 'http://bff:4100/api/forward/';
// s3 与 oss 通用配置
const s3AndOssDefaultConfig = {
    // s3 匹配图片域名
    originS3Domain: 'https://ab-s3-saas-515.s3-accelerate.amazonaws.com',
    // s3 替换的图片域名
    fastS3Domain: 'https://ab-s3-saas-515.s3-accelerate.amazonaws.com',
    fastS3DomainOld: 'https://img.monkey00.com',
    // oss 原地址
    originOSSDomain: 'https://markcoin-oss.oss-ap-southeast-1.aliyuncs.com',
    fastOSSDomain: 'https://markcoin-oss.chainstar.cloud',
    // oss 原地址 - 改造前
    originOSSDomainOld: 'https://markcoin.oss-ap-southeast-1.aliyuncs.com',
    fastOSSDomainOld: 'https://oss.chainstar.cloud',
    // upload 加速
    originDevS3ProdUploadDomain: 'https://nb-sg-prod-saas-515.s3.ap-southeast-1.amazonaws.com',
    fastDevS3ProdUploadDomain: 'https://nb-sg-prod-saas-515.s3.ap-southeast-1.amazonaws.com',
    originDevS3DevUploadDomain: 'https://nb-sg-dev-saas-515.s3.ap-southeast-1.amazonaws.com',
    fastDevS3DevUploadDomain: 'https://nb-sg-dev-saas.s3-515.ap-southeast-1.amazonaws.com',
    // 融合模式 s3 秘钥信息
    mergeModeS3ProdDomain: 'https://hybird-accesskey-prod-ab-saas-515.s3.ap-southeast-1.amazonaws.com',
    mergeModeS3TestDomain: 'https://hybird-accesskey-staging-saas-515.s3.ap-southeast-1.amazonaws.com',
    mergeModeS3DevDomain: 'https://hybird-accesskey-dev-saas-515.s3.ap-southeast-1.amazonaws.com',
};
// 生产统一 s3 桶
const s3ProdConfig = {
    originProdS3Domain: 'https://saas-s3-prod.s3.ap-southeast-1.amazonaws.com',
    fastProdS3Domain: 'https://saas-s3-prod.s3.ap-southeast-1.amazonaws.com',
};
// 测试统一 s3 桶
const s3StagingConfig = {
    originTestS3Domain: 'https://saas-s3-staging.s3.ap-southeast-1.amazonaws.com',
    fastTestS3Domain: 'https://saas-s3-staging.s3.ap-southeast-1.amazonaws.com',
};
// 开发统一 s3 桶
const s3DevConfig = {
    originDevS3Domain: 'https://newbit-dev-s3-saas-515.s3.ap-southeast-1.amazonaws.com',
    fastDevS3Domain: 'https://newbit-dev-s3-saas-515.s3-accelerate.amazonaws.com',
};
// 默认配置
const s3CommonConfig = Object.assign(Object.assign(Object.assign(Object.assign({}, s3AndOssDefaultConfig), s3ProdConfig), s3StagingConfig), s3DevConfig);
// uat 预发布环境 s3 通用配置
const s3UatConfig = Object.assign(Object.assign(Object.assign(Object.assign({}, s3AndOssDefaultConfig), s3StagingConfig), s3DevConfig), { originProdS3Domain: 'https://ab-uat-s3-saas-515.s3.ap-southeast-1.amazonaws.com', fastProdS3Domain: 'https://ab-uat-s3-saas-515.s3-accelerate.amazonaws.com' });

exports.commonServerBaseUrl = commonServerBaseUrl;
exports.getBaseServerUrl = getBaseServerUrl;
exports.getwayBaseUrl = getwayBaseUrl;
exports.s3AndOssDefaultConfig = s3AndOssDefaultConfig;
exports.s3CommonConfig = s3CommonConfig;
exports.s3DevConfig = s3DevConfig;
exports.s3ProdConfig = s3ProdConfig;
exports.s3StagingConfig = s3StagingConfig;
exports.s3UatConfig = s3UatConfig;
exports.uatServerBaseUrl = uatServerBaseUrl;
