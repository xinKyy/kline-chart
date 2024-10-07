import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { widget as Widget } from '@nbit/tradingview'

import {
  LanguageMapToChartMap,
  ThemeChartMap,
  TradingviewIndicatorType,
  WSThrottleTypeEnum,
  getCurrentQuoteShowCoin,
  CreateChartType,
  SwitchTimeType,
  KLineChartType,
  tradingviewTimeMap,
} from '@nbit/chart-utils'
import Datafeeds from './coin-datafeed'
import './index.css'

interface IChartType {
  time: string
  resolution: string
  currentCoin: any
  createChart: CreateChartType
  openChartProperties: string
  wsUrl: string
  ws: Record<string, any>
  theme: string
  coinHistoryKline: any
  klineCallback: any
  locale: string
  getKlineHistory: any
  baseMarketStore: any
  currentChart: string
  curTime: SwitchTimeType
  colors: number
  type: KLineChartType
}

function Tradingview(props: IChartType, ref) {
  const { resolution, colors } = props
  const currentCoinPair = getCurrentQuoteShowCoin(props.currentCoin.sellSymbol, props.currentCoin.buySymbol)
  const [widget, setWidget] = useState<any>(null)
  const widgetRef = useRef<any>(widget)
  const entityIdRef = useRef<any>()

  // rgba(var(--brand_color), 1)!important;

  const kLineCallback = data => {
    // 更新实时报价信息
    if (data?.length) {
      /** 传给tradingview的数据必须是number类型，字符串会报错，Ma会跳水 */
      props.klineCallback({
        ...data[0],
        time: Number(data[0].time),
        open: Number(data[0].open),
        close: Number(data[0].close),
        volume: Number(data[0].volume),
        quoteVolume: Number(data[0].quoteVolume),
        /** 后端返回数据有时候最高价小于开盘价，前端容错 */
        high: data[0].high < data[0].open ? data[0].open : data[0].high,
        low: data[0].low > data[0].close ? data[0].close : data[0].low,
      })
    }
  }

  const subs = {
    biz: props.type === KLineChartType.Quote ? 'spot' : 'perpetual',
    type: props.type === KLineChartType.Quote ? 'kline' : 'perpetual_kline',
    base: props.currentCoin.baseSymbolName,
    quote: props.currentCoin.quoteSymbolName,
    contractCode: props.currentCoin.symbolWassName,
  }

  useEffect(() => {
    props.ws.unsubscribe({
      subs,
      callback: kLineCallback,
    })
  }, [props.currentCoin.symbolName])

  useEffect(() => {
    if (props.coinHistoryKline.r && props.klineCallback && props.currentChart === 'tradingview') {
      props.ws.subscribe({
        subs,
        callback: kLineCallback,
        throttleType: WSThrottleTypeEnum.cover,
        throttleTime: 500,
      })
    }
    return () => {
      props.ws.unsubscribe({
        subs,
        callback: kLineCallback,
      })
    }
  }, [props.coinHistoryKline, props.klineCallback, props.currentChart])

  // useEffect(() => {
  //   if (widgetRef.current && props.openChartProperties) {
  //     if (props.openChartProperties === TradingviewIndicatorType.ChartProperties) {
  //       widgetRef.current.chart().executeActionById('chartProperties')
  //     }

  //     if (props.openChartProperties === TradingviewIndicatorType.InsertIndicator) {
  //       widgetRef.current.chart().executeActionById('insertIndicator')
  //     }
  //   }
  // }, [props.openChartProperties])

  // 控件背景颜色
  let styleColor = props.createChart.bgColor
  // 网格/网线颜色
  let wgColor = props.createChart.bgColor
  // 涨跌/交易量颜色
  let upColor = props.createChart.upColor
  let downColor = props.createChart.downColor
  // 坐标轴和刻度标签颜色
  let textColor = props.createChart.textColor

  useEffect(() => {
    const _widget = new Widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      // fullscreen: true, // 占用窗口所有空间
      // height: 442,
      // autosize: true, // 自动调整大小
      width: '100%' as any,
      height: '100%' as any,
      // symbol: 'A', // 初始商品 必须
      symbol: currentCoinPair,
      // @ts-ignore
      interval: tradingviewTimeMap[`${props.curTime.value}${props.curTime.unit}`], // 周期 必须
      container: 'tv_chart_container', // dom 引用
      //	BEWARE: no trailing slash is expected in feed URL
      // @ts-ignore
      // datafeed: new Datafeeds.UDFCompatibleDatafeed('https://demo-feed-data.tradingview.com'), // js api
      datafeed: new Datafeeds.UDFCompatibleDatafeed(props.baseMarketStore, props.getKlineHistory),
      library_path: `${location.origin}/charting_library/`, // 静态资源路径
      locale: LanguageMapToChartMap[props.locale as string] || 'en', // 本地化
      // disabled_features, enabled_features // 包含功能在默认情况下启用/禁用名称的数组。
      disabled_features: [
        'header_widget',
        'display_market_status',
        'pane_context_menu',
        'timeframes_toolbar',
        'go_to_date',
        'header_indicators', // 指标
        'header_settings', // 设置
        // 'header_fullscreen_button',
        // 'header_chart_type',
        // 'header_resolutions',
        'use_localstorage_for_settings',
        // 'header_symbol_search',
        // 'header_saveload',
        // 'header_interval_dialog_button',
        // 'header_undo_redo',
        // 'header_compare',
        // 'header_screenshot',
        /** 成交量柱状图分离 */
        'volume_force_overlay',
        // 'compare_symbol',
        // 'save_chart_properties_to_local_storage',
      ],
      enabled_features: ['study_templates'],
      // charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1', // 您的后台版本
      client_id: 'tradingview.com',
      user_id: 'public_id',
      // charts_storage_url, client_id, user_id // 这些参数与用于保存/加载的高级API相关
      // load_last_chart // 图表库为用户加载上次保存的图表
      theme: ThemeChartMap[props.theme] || ('Light' as any), // 主题色
      custom_css_url: './css/style.css', // 定义 CSS 添加到图表中
      // loading_screen // 定制加载进度条
      // favorites // 默认标记为收藏的项目
      // save_load_adapter  // 包含保存/加载功能的对象  //settings_adapter
      // compare_symbols // 自定义比较商品数组 additional_symbol_info_fields // 包含一组自定义交易商品信息字段的可选字段
      // header_widget_buttons_mode // 更改顶部工具栏上按钮外观的附加可选字段
      // time_scale  // 在屏幕上添加更多 K 线的附加可选字段
      time_scale: {
        min_bar_spacing: 5,
      },
      // timeframe // 初始时间范围
      timezone: 'Asia/Shanghai', // 初始时区
      // debug // info 写入控制台
      // width height
      // symbol_search_request_delay // 搜索延迟
      // auto_save_delay // 延迟秒数等待
      // toolbar_bg: styleColor, // 工具栏背景颜色
      // study_count_limit //多图布局
      // studies_access
      // drawings_access
      // Remark // 基于字体的绘图有一个特殊情况
      // saved_data // 包含已保存图表内容的 JS 对象
      // saved_data_meta_info // 包含保存的图表内容元信息的 JS 对象
      // numeric_formatting // 数字格式化
      // customFormatters // 自定义显示日期和时间的值
      // overrides // 对 Widget 对象的默认属性进行覆盖
      loading_screen: { backgroundColor: styleColor, foregroundColor: styleColor },
      overrides: {
        'paneProperties.background': styleColor,
        'paneProperties.backgroundGradientStartColor': styleColor,
        'paneProperties.backgroundGradientEndColor': styleColor,
        'mainSeriesProperties.style': 1,
        'mainSeriesProperties.candleStyle.upColor': upColor,
        'mainSeriesProperties.candleStyle.downColor': downColor,
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        // 'mainSeriesProperties.candleStyle.borderColor': '#fff',
        'mainSeriesProperties.candleStyle.borderUpColor': upColor,
        'mainSeriesProperties.candleStyle.borderDownColor': downColor,
        'mainSeriesProperties.candleStyle.wickUpColor': upColor,
        'mainSeriesProperties.candleStyle.wickDownColor': downColor,
        // 'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
        // 边际（百分比）。 用于自动缩放。
        // 'paneProperties.topMargin': 5,
        'paneProperties.bottomMargin': 5,
        // 'volumePaneSize': 'large', // 成交量大小
      },
      // 涨幅柱子颜色
      studies_overrides: {
        'volume.volume.color.1': props.createChart.upColor,
        'volume.volume.color.0': props.createChart.downColor,
        'volume.volume.transparency': 50,
      },
      // overrides: {
      //   'paneProperties.backgroundType': 'solid',
      //   'paneProperties.background': '#000000',
      //   'paneProperties.crossHairProperties.color': textColor,
      //   'mainSeriesProperties.candleStyle.upColor': upColor,
      //   'mainSeriesProperties.candleStyle.downColor': downColor,
      //   'mainSeriesProperties.showCountdown': !1,
      //   // 烛心
      //   'mainSeriesProperties.candleStyle.drawWick': true,
      //   // 烛心颜色
      //   'mainSeriesProperties.candleStyle.wickUpColor': upColor,
      //   'mainSeriesProperties.candleStyle.wickDownColor': downColor,
      //   // 边框
      //   'mainSeriesProperties.candleStyle.drawBorder': true,
      //   'mainSeriesProperties.candleStyle.borderUpColor': upColor,
      //   'mainSeriesProperties.candleStyle.borderDownColor': downColor,
      //   // 网格
      //   'paneProperties.vertGridProperties.style': 0,
      //   'paneProperties.horzGridProperties.color': wgColor,
      //   'paneProperties.vertGridProperties.color': wgColor,
      //   // 坐标轴和刻度标签颜色
      //   'scalesProperties.lineColor': wgColor,
      //   'scalesProperties.textColor': textColor,
      //   'scalesProperties.fontSize': 12, // 图标区域xy轴 字体大小
      //   // 是否显示指标文字参数
      //   // 折叠信息
      //   'paneProperties.legendProperties.showLegend': true,
      //   'paneProperties.legendProperties.showBarChange': true, // K线变化值
      //   'paneProperties.legendProperties.showSeriesOHLC': true,
      //   'paneProperties.legendProperties.showStudyValues': true,
      //   'paneProperties.legendProperties.showOnlyPriceSource': true,
      //   'paneProperties.legendProperties.showStudyArguments': true,
      //   'volumePaneSize': 'medium', // 成交量大小
      // },
      // snapshot_url // 当用户按快照按钮时，使用 base64 编码将当前图表快照保存并返回 URL
      // custom_indicators_getter // 返回带有自定义指标数组的 Promise 对象的函数
      // preset // 预设
      // studies_overrides // 使用此选项自定义默认指标的样式及输入值
      // time_frames // 可以在图表底部选择的可见时间范围列表
      time_frames: [],
      // time_frames: [
      //   { text: "50y", resolution: "6M", description: "50 Years" },
      //   { text: "3y", resolution: "W", description: "3 Years", title: "3yr" },
      //   { text: "8m", resolution: "D", description: "8 Month" },
      //   { text: "3d", resolution: "5", description: "3 Days" },
      //   { text: "1000y", resolution: "W", description: "All", title: "All" },
      // ]
    })
    setWidget(_widget)
    widgetRef.current = _widget

    widgetRef.current.onChartReady?.(() => {
      /** 创建 ma 均线 */
      widgetRef.current
        .chart()
        .createStudy('Moving Average', false, false, [5, 'close', 0], { 'plot.color.0': '#7F4E86' })
      widgetRef.current
        .chart()
        .createStudy('Moving Average', false, false, [10, 'close', 0], { 'plot.color.0': '#ECC581' })
      widgetRef.current
        .chart()
        .createStudy('Moving Average', false, false, [20, 'close', 0], { 'plot.color.0': '#D057E4' })
      widgetRef.current
        .chart()
        .createStudy('Moving Average', false, false, [60, 'close', 0], { 'plot.color.0': '#6F92EE' })

      /** 创建量图 */
      entityIdRef.current = widgetRef.current.chart().createStudy('Volume', false, false)
    })
  }, [])

  const applyOverrides = () => {
    widgetRef.current.applyOverrides({
      'paneProperties.background': styleColor,
      'paneProperties.backgroundGradientStartColor': styleColor,
      'paneProperties.backgroundGradientEndColor': styleColor,
      'mainSeriesProperties.style': 1,
      'mainSeriesProperties.candleStyle.upColor': upColor,
      'mainSeriesProperties.candleStyle.downColor': downColor,
      'mainSeriesProperties.candleStyle.drawWick': true,
      'mainSeriesProperties.candleStyle.drawBorder': true,
      // 'mainSeriesProperties.candleStyle.borderColor': '#fff',
      'mainSeriesProperties.candleStyle.borderUpColor': upColor,
      'mainSeriesProperties.candleStyle.borderDownColor': downColor,
      'mainSeriesProperties.candleStyle.wickUpColor': upColor,
      'mainSeriesProperties.candleStyle.wickDownColor': downColor,
      // 'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
      // 边际（百分比）。 用于自动缩放。
      // 'paneProperties.topMargin': 5,
      'paneProperties.bottomMargin': 5,
      // 'volumePaneSize': 'large', // 成交量大小
    })
  }

  useEffect(() => {
    /** 分时图为折线，其它线为 k 线 */
    if (widgetRef.current) {
      widgetRef.current.onChartReady?.(() => {
        if (props.curTime.unit === 'time') {
          widgetRef.current.applyOverrides({
            'mainSeriesProperties.style': 2,
            'mainSeriesProperties.lineStyle.color': upColor,
          })
        } else {
          widgetRef.current.applyOverrides({
            'mainSeriesProperties.style': 1,
          })
        }
      })
    }
  }, [props.curTime])

  useEffect(() => {
    let timer
    if (widgetRef.current) {
      widgetRef.current.onChartReady?.(() => {
        widgetRef.current.changeTheme(ThemeChartMap[props.theme])

        /** 修改主题色，不异步执行 tradingview 不会生效 */
        timer = setTimeout(() => {
          applyOverrides()
        })
      })
    }
    return () => {
      clearTimeout(timer)
    }
  }, [props.theme, colors])

  useEffect(() => {
    widgetRef.current?.onChartReady?.(() => {
      /** 创建量图 */

      entityIdRef.current.then(res => {
        widgetRef.current.activeChart().removeEntity(res)
        entityIdRef.current = widgetRef.current.chart().createStudy('Volume', false, false)
        widgetRef.current.applyStudiesOverrides({
          'volume.volume.color.1': props.createChart.upColor,
          'volume.volume.color.0': props.createChart.downColor,
          'volume.volume.transparency': 50,
        })
      })
    })
  }, [colors])

  useEffect(() => {
    let timer
    if (widgetRef.current && resolution && currentCoinPair) {
      widgetRef.current.onChartReady?.(() => {
        widgetRef.current.setSymbol(currentCoinPair, resolution, () => null)
        timer = setTimeout(() => {
          applyOverrides()
        })
      })
    }
    return () => {
      clearTimeout(timer)
    }
  }, [resolution])

  useImperativeHandle(ref, () => ({
    chartProperties: () => {
      if (widgetRef.current) {
        widgetRef.current.onChartReady?.(() => {
          widgetRef.current.chart?.()?.executeActionById?.('chartProperties')
          return true
        })
      }
      return false
    },
    insertIndicator: () => {
      if (widgetRef.current) {
        widgetRef.current.onChartReady?.(() => {
          widgetRef.current.chart?.()?.executeActionById?.('insertIndicator')
          return true
        })
      }
      return false
    },
  }))

  return <div style={{ background: styleColor }} className="rel-chart" id="tv_chart_container"></div>
}

export default forwardRef(Tradingview)
