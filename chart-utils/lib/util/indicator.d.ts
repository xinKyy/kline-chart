import { KLineChartData, TimeSharingType } from '../type';
interface SMAType {
    time: number;
    value: number;
}
/**
 * 计算 SMA
 */
declare const calculateSMA: (data: any, count: number, price: string, priceOffset: any) => Array<SMAType>;
/**
 * 计算EMA
 * // ema 上一日
 * // price 价格,dif
 * // period 日期
 */
declare const calculateEMA: (ema: number, price: number, period: number) => number;
interface CalMacdType {
    emaFast: number;
    emaSlow: number;
    dif: number;
    dea: number;
    value: number;
    time: number;
}
/**
 * 计算 MACD
 * fast 快线
 * slow 慢线
 * signal 日期
 */
declare const calculateMACD: (data: any, fast: number, slow: number, signal: number, priceOffset: any) => Array<CalMacdType>;
declare const updateTimeOfData: (value: number, type: TimeSharingType, kLineChartData: Array<KLineChartData>) => Array<KLineChartData>;
export { calculateSMA, calculateMACD, calculateEMA, updateTimeOfData };
export declare const calBoll: (data: any, calcParams: number[] | undefined, priceOffset: any) => {
    mid: number;
    upper: number;
    lower: number;
    time: number;
}[];
/**
 * 计算KDJ指标
 * EMV：随机指标。一般是用于股票分析的统计体系，根据统计学原理，通过一个特定的周期（常为9日、9周等）内出现过的最高价、最低价及
 * 最后一个计算周期的收盘价及这三者之间的比例关系，来计算最后一个计算周期的未成熟随机值RSV，然后根据平滑移动平均线的方法来计算K值、D值与J值，
 * 并绘成曲线图来研判股票价格走势。
 *
 * KDJ指标计算方式
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
export declare function calKdj(data: any, calcParams: number[] | undefined, priceOffset: any): {
    k: number;
    d: number;
    j: number;
    time: number;
}[];
/**
 * EMA
 * @param {number} X
 * @param {number} YPre 客户端指标解释中的 Y'
 * @param {number} N
 * @returns {number}
 */
export declare const EMA: (X: any, YPre: any, N: any) => number;
export declare const MAX: (a: any, b: any) => number;
export declare const MIN: (a: any, b: any) => number;
export declare const ABS: (a: any) => number;
export declare const SMA: (x: any, n: any, m: any, y: any) => number;
export declare function calRsi(data: any, calcParams: number[] | undefined, priceOffset: any): {
    r: number;
    s: number;
    i: number;
    time: number;
}[];
/**
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
export declare function calcHnLn(dataList: any): {
    hn: number;
    ln: number;
};
export declare function calWr(dataList: any, options: any, plots: {
    key: string;
    title: string;
}[] | undefined, priceOffset: any): any;
/** 计算涨跌幅 */
export declare const calcChg: (value: any, priceOffset: any) => string;
/** 计算振幅 */
export declare const calcAmp: (value: any, priceOffset: any) => string;
