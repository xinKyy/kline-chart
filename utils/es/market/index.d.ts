/**
 * 计算两个值相对涨跌
 * @param price 当前价格
 * @param target 目标价格，可空，如果不传就是和 0 进行比较
 * @returns 'text-buy_up_color' | 'text-sell_down_color' | ''
 */
export declare function getColorClassByPrice(price?: number | string, target?: number | string): string;
