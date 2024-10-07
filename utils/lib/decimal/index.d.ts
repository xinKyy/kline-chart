import Decimal from 'decimal.js';
/**
 * 设置精度位 - 最大有效字位数
 * @param val
 */
export declare function setPrecision(val: any): void;
/**
 * 将安全金额的字符串还原回原始数字字符串，方便和后续的 decimal 计算
 * @param safeCurrency 安全金额的字符串
 * @returns 去除掉其他符号的数字字符串
 */
export declare function getSafeCurrency(safeCurrency: string | number | undefined | null): string | number;
/** 将值安全转换为 Decimal 数据 */
export declare function getSafeDecimal(value: Decimal.Value): Decimal;
/**
 * 添加安全的计算工具
 */
export declare const SafeCalcUtil: {
    mul(a: any, b: any): Decimal;
    div(a: any, b: any): Decimal;
    add(a: any, b: any): Decimal;
    sub(a: any, b: any): Decimal;
};
/**
 * 处理 '-0' '+0' 场景
 */
export declare function formatZeroPrefix(value: string, digits?: number): string;
/**
 * 去掉小数点后面多余的 0
 * @param val
 */
export declare const removeDecimalZero: (val: string) => string;
export type IIsRound = boolean | Decimal.Rounding;
/**
 * 数字格式化 - 按照指定小数点位输出
 * @param data    要截取的数据
 * @param digits 指定小数点位数
 * @param isRound 是否向上约 | 传入具体 Decimal.Rounding 策略
 * @param delPostZero 是否去除末尾 0
 * @returns
 */
export declare const formatNumberDecimal: (data: any, digits?: number, isRound?: IIsRound, delPostZero?: boolean) => string;
/**
 * 将对象中的某个 key 进行约小数位
 */
export declare function formatObjectNumberByKeys(obj: any, keys: any, offset: any): any;
/**
 * 资产金额格式化，三位加逗号
 * @param data         要格式化的数据
 * @param digits      保留几位小数
 * @param keepDigits 是否始终保持对应位数的小数，不足补 0
 * @returns
 */
export declare const formatCurrency: (data: any, digits?: number, keepDigits?: boolean, isRound?: IIsRound) => string;
/**
 * 获取某个数的小数位
 */
export declare function getDigits(data: any): any;
