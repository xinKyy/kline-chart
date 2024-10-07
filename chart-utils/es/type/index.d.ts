export interface DeptChartData {
    time: number;
    value: number;
    [key: string]: any;
}
export declare enum DeptChartSpecieEnum {
    Dept = "dept",
    DeptCurrent = "deptCurrent"
}
export interface DeptChartPropsType {
    data: Array<DeptChartData>;
    chartLayoutOptions: any;
    createChart: {
        brandColor: string;
        upColor: string;
        downColor: string;
        upLightColor: string;
        downLightColor: string;
        bgColor?: string;
        textColor?: string;
        cardBgColor?: string;
        textColor01?: string;
        cardBgColor03?: string;
    };
}
export type CommonMainOrSubType = {
    select: boolean;
    value?: number | string;
    color: string;
    name?: string;
};
export declare enum TimeSharingType {
    Min = "m",
    Hour = "h",
    Day = "D",
    Week = "W",
    Mon = "M",
    Second = "s"
}
export interface SwitchTimeType {
    unit: string;
    value: string | number;
}
export interface MainSubType {
    checked: boolean;
    select: boolean;
    strip: string | number;
    type: string;
    color: string;
}
export interface SubType {
    fast: string | number | CommonMainOrSubType;
    slow: string | number | CommonMainOrSubType;
    signal: string | number | CommonMainOrSubType;
}
type BollType = {
    mid: number | CommonMainOrSubType;
    std: number | CommonMainOrSubType;
};
export interface MainIndicatorType {
    ma: {
        name?: string;
        hide?: boolean;
        select: boolean;
        expand: boolean;
        init: Array<MainSubType>;
        cur: Array<MainSubType>;
    };
    boll: {
        name?: string;
        hide?: boolean;
        select: boolean;
        expand: boolean;
        init: BollType;
        cur: BollType;
        curLine?: Array<CommonMainOrSubType>;
        initLine?: Array<CommonMainOrSubType>;
    };
}
type KdjType = {
    k: number | CommonMainOrSubType;
    d: number | CommonMainOrSubType;
    j: number | CommonMainOrSubType;
};
type WrRsiType = {
    name?: string;
    select: boolean;
    hide?: boolean;
    expand: boolean;
    init: Array<CommonMainOrSubType>;
    cur: Array<CommonMainOrSubType>;
};
export interface SubIndicatorType {
    vol?: {
        name?: string;
        hide?: boolean;
        select: boolean;
        expand: boolean;
    };
    macd: {
        name?: string;
        hide?: boolean;
        select: boolean;
        expand: boolean;
        init: SubType;
        cur: SubType;
        curLine?: Array<CommonMainOrSubType>;
        initLine?: Array<CommonMainOrSubType>;
    };
    kdj: {
        name?: string;
        hide?: boolean;
        select: boolean;
        expand: boolean;
        init: KdjType;
        cur: KdjType;
        curLine?: Array<CommonMainOrSubType>;
        initLine?: Array<CommonMainOrSubType>;
    };
    rsi: WrRsiType;
    wr: WrRsiType;
}
export interface BackgroundType {
    color: string;
}
export interface ChartLayoutOptionsType {
    background: BackgroundType;
    textColor: string;
}
export interface KLineChartData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    quoteVolume?: number;
    [key: string]: any;
}
export interface SeriesChartData {
    time: number;
    value: number;
    [key: string]: any;
}
export declare enum KLineChartType {
    Quote = "quote",
    ContractFunding = "contractFunding",
    Futures = "futures",
    Ternary = "ternary-option"
}
export interface ReturnThemeType {
    bgColor: string;
    textColor: string;
    brandColor: string;
    upColor: string;
    downColor: string;
    upLightColor: string;
    downLightColor: string;
    cardBgColor: string;
    cardBgColor03: string;
    textColor01: string;
    downSpecialColor02: string;
    upSpecialColor02: string;
    cardBgColor02: string;
    textColor02: string;
}
export interface DeptList {
    asks: Array<Array<string>>;
    bids: Array<Array<string>>;
    buyOrSellCnyPrice: string;
    cny: string;
    last: string;
    open: string;
    usdtCnyPrice: number;
}
export interface MarkersType {
    time: number;
    position: string;
    color: string;
    shape: string;
    text: string;
    id: number;
    price: number;
    count: number;
    fees: number;
}
export interface CurMarkersDetail {
    total: number;
    avg: number;
    count: number;
}
export interface CurMarkersType {
    x: number;
    y: number;
    buyData: Array<MarkersType>;
    sellData: Array<MarkersType>;
    buyDetail: CurMarkersDetail;
    sellDetail: CurMarkersDetail;
}
export interface OrdersKlineDataType {
    /**
     * 成交均价
     */
    averagePrice?: number;
    /**
     * 计价币
     */
    buyCoinShortName?: string;
    /**
     * 创建时间 yyyy-mm-dd hh:MM:ss
     */
    createdByTime?: number;
    /**
     * 标的币
     */
    sellCoinShortName?: string;
    /**
     * 成交数量
     */
    successCount?: number;
    /**
     * 币对
     */
    symbol?: string;
    /**
     * 币对id
     */
    tradeId?: number;
    /**
     * 成交明细
     */
    transactionLogs?: Array<{
        /**
         * 数量
         */
        count?: number;
        /**
         * 创建时间
         */
        createdByTime?: number;
        /**
         * 手续费
         */
        fees?: number;
        /**
         * 价格
         */
        price?: number;
    }>;
    /**
     *  1买单 2卖单
     */
    side?: number;
}
export interface CreateChartType {
    brandColor: string;
    upColor: string;
    downColor: string;
    bgColor: string;
    textColor: string;
    textColor01?: string;
    upSpecialColor02?: string;
    downSpecialColor02?: string;
    cardBgColor02?: string;
    textColor02?: string;
}
export interface SubKType {
    dea: number | undefined;
    dif: number | undefined;
    macd: number | undefined;
}
export {};
