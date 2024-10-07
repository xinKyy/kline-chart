'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('./common.js');

const s3ImConfig = Object.assign(Object.assign({}, common.s3CommonConfig), { 
    // s3 生产环境加速
    originProdS3Domain: 'https://im-prod-s3-saas-515.s3.ap-southeast-1.amazonaws.com', fastProdS3Domain: 'https://im-prod-s3-saas-515.s3-accelerate.amazonaws.com', 
    // s3 测试环境加速
    originTestS3Domain: 'https://im-s3-staging-saas-515.s3.ap-southeast-1.amazonaws.com', fastTestS3Domain: 'https://im-s3-staging-saas-515.s3-accelerate.amazonaws.com', 
    // 融合模式 s3 秘钥信息
    mergeModeS3ProdDomain: 'https://hybird-accesskey-prod-aa-saas-515.s3.ap-southeast-1.amazonaws.com' });

exports.s3ImConfig = s3ImConfig;
