import { MerchantIDEnum } from '../env';
/**
 * 判断是否是 S3、OSS 然后把地址替换成高速通道 URL
 */
export declare function getFastUrl(url: string, id?: MerchantIDEnum): string;
/**
 * 给 url 地址添加当天零点的时间戳以便于刷新缓存
 */
export declare function getUrlWithTimestamp(url: string): string;
export declare function getFileType(url: any): string;
export declare function injectThemeImgUrl(url: any, theme: any): any;
/**
 * url 传进来的地址
 * whetherManyBusiness: 是否是多商户模式图片
 * businessId: 商户 id
 */
export declare function getFastManyBusinessUrl(url: any, whetherManyBusiness?: boolean, businessId?: string): any;
