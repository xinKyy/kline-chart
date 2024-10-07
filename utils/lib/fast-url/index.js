'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index$1 = require('../env/index.js');

/**
 * 判断是否是 S3、OSS 然后把地址替换成高速通道 URL
 */
function getFastUrl(url, id = index$1.MerchantIDEnum.common) {
    if (typeof url !== 'string') {
        console.log(url, 'getFastUrl: 请检查下传入的 URL 不为字符串');
        return url;
    }
    const { originS3Domain, fastS3Domain, fastS3DomainOld, originOSSDomain, fastOSSDomain, originOSSDomainOld, fastOSSDomainOld, originProdS3Domain, fastProdS3Domain, originTestS3Domain, fastTestS3Domain, originDevS3Domain, fastDevS3Domain, originDevS3ProdUploadDomain, fastDevS3ProdUploadDomain, originDevS3DevUploadDomain, fastDevS3DevUploadDomain } = index$1.MerchantID[id] || index$1.MerchantID[index$1.MerchantIDEnum.common];
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
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const timestamp = date.getTime();
    if (typeof url !== 'string') {
        console.log(url, 'getUrlWithTimestamp: 请检查下传入的 URL 不为字符串');
        return url;
    }
    // 没有后缀的情况下不添加时间戳
    if (!getFileType(url)) {
        return url;
    }
    return url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;
}
function hasSingleChars(str, currentStr) {
    let charMap = {};
    let result = false;
    for (let char of str) {
        if (currentStr === char) {
            if (charMap[char]) {
                result = false;
            }
            charMap[char] = true;
            result = true;
        }
    }
    return result;
}
function getFileType(url) {
    if (typeof url !== 'string') {
        console.log(url, 'getFileType: 请检查下传入的 URL 不为字符串');
        return '';
    }
    url = url.split('?')[0] || '';
    const allNames = url.split('/') || [];
    const nameArr = allNames.slice(3, allNames.length);
    let hasTypeStr = '';
    nameArr.forEach(v => {
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
    const allNames = url.split('/') || [];
    const nameArr = allNames.slice(3, allNames.length);
    let strHasType = '';
    nameArr.forEach(v => {
        if (hasSingleChars(v, '.')) {
            strHasType = v;
        }
    });
    if (strHasType) {
        const [name, type] = strHasType.split('.');
        return url.replace(strHasType, `${name}${theme}.${type}`);
    }
    return `${url}${theme}`;
}
/**
 * url 传进来的地址
 * whetherManyBusiness: 是否是多商户模式图片
 * businessId: 商户 id
 */
function getFastManyBusinessUrl(url, whetherManyBusiness, businessId) {
    /** 是否是多商户模式图片，如果是就会替换想换路径 * */
    if (whetherManyBusiness) {
        url = url.replace('/h5/image/', `/h5/business/${businessId}/business-img/`);
    }
    return url;
}

exports.getFastManyBusinessUrl = getFastManyBusinessUrl;
exports.getFastUrl = getFastUrl;
exports.getFileType = getFileType;
exports.getUrlWithTimestamp = getUrlWithTimestamp;
exports.injectThemeImgUrl = injectThemeImgUrl;
