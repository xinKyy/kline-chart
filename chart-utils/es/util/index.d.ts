import { KLineChartData } from '../type';
export declare const sortMarketChartData: (data: Array<KLineChartData>) => KLineChartData[];
/** 当前行情币对，ws 传给后端 */
export declare const getCurrentQuoteApiCoin: (sellSymbol: string, buySymbol: string) => string;
/** 当前行情币对 页面展示 */
export declare const getCurrentQuoteShowCoin: (sellSymbol: string, buySymbol: string) => string;
/** 横屏功能 */
export declare const fullscreen: (fullscreenRef: any, isFullScreen: any, setIsFullScreen: any) => void;
/** 上涨 */
export declare const checkIsUp: (value: any) => boolean;
/** k 线横坐标 */
export declare const showFormatTime: (item: any, unit: any) => string;
