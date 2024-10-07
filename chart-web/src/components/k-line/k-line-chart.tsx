import dayjs from 'dayjs'
import {
  createChart,
  DeepPartial,
  CandlestickStyleOptions,
  LineStyle,
  ISeriesApi,
  LineData,
  CandlestickData,
  LineWidth,
  SeriesMarker,
  Time,
  BarPrice,
  HistogramData,
  CrosshairMode,
} from '@nbit/lightweight-charts'
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import {
  KLineChartData,
  MainIndicatorType,
  SubIndicatorType,
  ChartLayoutOptionsType,
  SwitchTimeType,
  ThemeEnum,
  calculateSMA,
  calculateMACD,
  calBoll,
  calRsi,
  calKdj,
  calWr,
  CommonMainOrSubType,
  checkIsUp,
  calcChg,
  calcAmp,
  showFormatTime,
  CreateChartType,
  OrdersKlineDataType,
  MarkersType,
  CurMarkersType,
  TimeSharingType,
} from '@nbit/chart-utils'

import './index.css'
import KLineRender from './k-line-render'
import {
  calChartIndicatorPositon,
  calHeightAndLowPoint,
  calQuickBuyAndSellPoint,
  getBuyMarkers,
  getMarkers,
  MainKType,
  SubKType,
  subscribeClickChange,
  tradeDirection,
  tradeStatus,
} from './helper'

interface PropsType {
  data: Array<KLineChartData>
  mainIndicator: MainIndicatorType
  subIndicator: SubIndicatorType
  createChart: CreateChartType
  chartLayoutOptions: ChartLayoutOptionsType
  curTime: SwitchTimeType
  theme: string
  locale: string
  ordersKlineData: OrdersKlineDataType[]
  expandIcon: React.ReactElement
  chartSettingIcon: {
    hidden: React.ReactElement
    setting: React.ReactElement
    delete: React.ReactElement
    hiddenHover: React.ReactElement
    settingHover: React.ReactElement
    deleteHover: React.ReactElement
  }
  coinInfo: {
    baseSymbolName: string
    quoteSymbolName: string
  }
  getDataAndUpdateChart: number
  getMoreKlineData: (v) => void
  offset: {
    priceOffset: number
    amountOffset: number
  }
  // marketChangesTime: number
  updateMarketChangesTime: (v) => void
  colors: number
  updateMainIndicator: (v) => void
  updateSubIndicator: (v) => void
  curDataRef: any
  modalRef:
    | {
        openChartSettingModal: () => void
      }
    | undefined
  ordersData?: any
  optionIcon?: any
  optionBuyCallback?: any
  optionSellCallback?: any
  optionActiveTab?: any
  countDownComponent?: any
  tradeRestSecond?: any
  optionAnimation?: any
}

type IChartApi = ReturnType<typeof createChart>

/** 涨跌色 */
export enum UserUpsAndDownsColorEnum {
  greenUpRedDown = 1, // 绿涨红跌
  redUpGreenDown = 2, // 红涨绿跌
}

function KLineChart(props: PropsType, ref) {
  const {
    mainIndicator,
    subIndicator,
    ordersKlineData,
    getMoreKlineData,
    offset,
    // marketChangesTime,
    updateMarketChangesTime,
    colors,
    chartSettingIcon,
    ordersData,
    optionBuyCallback,
    optionSellCallback,
    optionIcon,
    optionActiveTab,
    countDownComponent,
    tradeRestSecond,
    optionAnimation,
  } = props

  const { priceOffset, amountOffset } = offset
  const chartPriceLineProperty = {
    crosshairMarkerVisible: false,
    baseLineVisible: false,
    priceLineVisible: false,
    lastValueVisible: false,
    lineType: 2,
  }

  const mainIndicatorRef = useRef<MainIndicatorType>()
  const subIndicatorRef = useRef<SubIndicatorType>()

  /** 是否悬浮图表 */
  const isHoverChart = useRef<boolean>(false)
  const chartRef = useRef<IChartApi>()
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'>>()
  const macdVolumeSeriesRef = useRef<ISeriesApi<'Histogram'>>()
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>()
  const smaLineRef = useRef<Array<ISeriesApi<'Line'>>>()
  const timeLineRef = useRef<ISeriesApi<'Line'>>()
  const [popVisible, setPopVisible] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const propsDataRef = useRef<Array<KLineChartData>>(props.data)
  const curTimeRef = useRef<SwitchTimeType>(props.curTime)
  const colorsRef = useRef<number>(UserUpsAndDownsColorEnum.greenUpRedDown)

  useEffect(() => {
    // propsDataRef.current = props.data
    curTimeRef.current = props.curTime
    mainIndicatorRef.current = props.mainIndicator
    subIndicatorRef.current = props.subIndicator
    colorsRef.current = colors
  }, [props.data, props.curTime, props.mainIndicator, props.subIndicator, colors])
  // propsDataRef.current = props.curDataRef || []
  const markersRef = useRef<Array<MarkersType | any>>()
  const buyMarkersRef = useRef<any>()
  const ordersDataRef = useRef<any>()
  const deaRef = useRef<ISeriesApi<'Line'>>()
  const difRef = useRef<ISeriesApi<'Line'>>()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const outOfTimeValue = useRef<any>()
  const [heightChange, setHeightChange] = useState<number>(0)

  const [tradeStatusOverList, setTradeStatusOverList] = useState<any>([])

  ordersDataRef.current = ordersData
  const bollRef = useRef<{
    mid: ISeriesApi<'Line'>
    upper: ISeriesApi<'Line'>
    lower: ISeriesApi<'Line'>
  }>()

  const kdjRef = useRef<{
    k: ISeriesApi<'Line'>
    d: ISeriesApi<'Line'>
    j: ISeriesApi<'Line'>
  }>()

  const [curMaxAndMinPoint, setCurMaxAndMinPoint] = useState({
    min: {
      time: 0,
      value: 0,
      x: 0,
      y: 0,
    },
    max: {
      time: 0,
      value: 0,
      x: 0,
      y: 0,
    },
  })

  const [curBuyAndSellPoint, setCurBuyAndSellPoint] = useState({
    min: {
      time: 0,
      value: 0,
      x: 0,
      y: 0,
    },
    max: {
      time: 0,
      value: 0,
      x: 0,
      y: 0,
    },
  })

  const rsiRef = useRef<Array<ISeriesApi<'Line'>>>()

  const wrRef = useRef<Array<ISeriesApi<'Line'>>>()

  const [tableData, setTableData] = useState<Array<MarkersType>>([])
  const [curMarkers, setCurMarkers] = useState<CurMarkersType>()
  const [maIndicator, setMaIndicator] = useState<Array<number>>()
  const [visibleTimeRange, setVisibleTimeRange] = useState({
    from: 0,
    to: 0,
  })

  const [mainK, setMainK] = useState<MainKType>()

  const [subK, setSubK] = useState<SubKType>()

  const [volume, setVolume] = useState<{
    vol: number
    quoteVolume: number
    dir: string
  }>({
    vol: 0,
    quoteVolume: 0,
    dir: 'rise',
  })

  const [bollK, setBollK] = useState<{
    mid: number
    upper: number
    lower: number
  }>({
    mid: 0,
    upper: 0,
    lower: 0,
  })

  const [kdjK, setKdjK] = useState<{
    k: number
    d: number
    j: number
  }>()

  const [rsiK, setRsiK] = useState<{
    r: number
    s: number
    i: number
  }>()

  const [wrK, setWrK] = useState<Array<number>>()

  // const [point, setPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  /** 指标在图表中的位置计算 */
  const { chartScaleMargins, volScaleMargins, macdScaleMargins, kdjScaleMargins, rsiScaleMargins, wrScaleMargins } =
    calChartIndicatorPositon(subIndicator)

  const gridColor = props.theme === ThemeEnum.light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        timeScale: {
          barSpacing: 10,
          minBarSpacing: 1,
          tickMarkFormatter: item => {
            return showFormatTime(item, props.curTime.unit)
          },
        },
      })
    }
  }, [props.curTime.unit, props.curTime.value])

  const chartPropertySetting = {
    layout: props.chartLayoutOptions,
    localization: {
      timeFormatter: item => {
        if (props.curTime.unit === TimeSharingType.Second) {
          return dayjs(item).format('YYYY/MM/DD HH:mm:ss')
        }
        return dayjs(item).format('YYYY/MM/DD HH:mm')
      },
      priceFormatter: item => {
        return `${item.toFixed(priceOffset)}`
      },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    timeScale: {
      barSpacing: 6,
      minBarSpacing: 1,
      // rightOffset
      tickMarkFormatter: item => {
        return showFormatTime(item, props.curTime.unit)
      },
      borderColor: gridColor,
      lockVisibleTimeRangeOnResize: true,
      // rightBarStaysOnScroll: true,
      // fixLeftEdge: true,
      // fixRightEdge: true,
    },
    rightPriceScale: {
      scaleMargins: chartScaleMargins,
      visible: true,
      alignLabels: true,
      autoScale: true,
      borderColor: gridColor,
      // ticksVisible: true,
    },

    /** 叠加价格尺度 */
    // overlayPriceScales
  }

  useEffect(() => {
    /** 平滑效果 */
    /** 考虑了3个可能性，切换tab时，改变屏幕大小时，滚动时都会对可见区域处理，这块极其容易出bug */
    requestAnimationFrame(() => {
      calHeightAndLowPoint(
        visibleTimeRange,
        curTimeRef,
        propsDataRef,
        timeLineRef,
        candlestickSeriesRef,
        chartRef,
        setCurMaxAndMinPoint,
        props.createChart,
        priceOffset
      )

      calQuickBuyAndSellPoint(
        visibleTimeRange,
        curTimeRef,
        propsDataRef,
        timeLineRef,
        candlestickSeriesRef,
        chartRef,
        setCurBuyAndSellPoint,
        props.createChart,
        priceOffset
      )
    })
  }, [visibleTimeRange, subIndicator, props.getDataAndUpdateChart])

  useEffect(() => {
    chartRef.current?.applyOptions({
      width: containerRef.current?.clientWidth,
      height: containerRef.current?.clientHeight,
      rightPriceScale: {
        ...chartPropertySetting.rightPriceScale,
        scaleMargins: chartScaleMargins,
      },
    })
    if (chartRef.current?.timeScale().getVisibleRange()?.from) {
      setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
    }
  }, [containerRef.current?.clientHeight])

  useEffect(() => {
    chartRef.current = createChart(document.getElementById('chart') as HTMLElement, chartPropertySetting)
    chartRef.current.applyOptions({
      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: false,
        },
        // mouseWheel: false,
        pinch: true,
      },
    })
    chartRef.current.timeScale().fitContent()
    const subscribeTimeChange = newVisibleTimeRange => {
      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
      }

      setPopVisible(false)
    }
    /** 最高价最低价逻辑 */
    chartRef.current.timeScale().subscribeVisibleTimeRangeChange(subscribeTimeChange)

    /** 订阅图表滚动事件 */
    const sizeChange = () => {
      buyMarkersRef.current = getBuyMarkers(ordersData, propsDataRef, props.createChart) || []
      const oldData =
        timeLineRef.current?.markers()?.filter(item => {
          return item.id?.toString() === '1' || item.id?.toString() === '2'
        }) || []

      timeLineRef.current?.setMarkers(
        oldData.concat(buyMarkersRef.current)?.sort?.((a, b) => {
          return Number(a.time) - Number(b.time)
        }) as unknown as SeriesMarker<Time>[]
      )
    }
    let timer
    function onVisibleLogicalRangeChanged(newVisibleLogicalRange) {
      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
      }
      timer = setTimeout(() => {
        let logicalRange = chartRef.current?.timeScale()?.getVisibleLogicalRange()

        if (logicalRange !== null) {
          const curRef =
            curTimeRef.current.unit === 'time' || curTimeRef.current.unit === 's'
              ? timeLineRef.current
              : candlestickSeriesRef.current
          const barsInfo: any = curRef?.barsInLogicalRange(logicalRange as any)
          if (barsInfo !== null && barsInfo?.barsBefore < 10) {
            getMoreKlineData({ time: propsDataRef.current?.[0]?.time })
            clearTimeout(timer)
          }
        }
      }, 500)
    }

    chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged)

    /** 订阅图表点击事件 */

    chartRef.current.subscribeClick(param => {
      subscribeClickChange(param, markersRef, setPopVisible, props, priceOffset, setCurMarkers)
    })

    // chartRef.current.timeScale().subscribeSizeChange(sizeChange)

    /** 订阅图表悬浮事件 */
    const subscribeMoveChange = param => {
      const time = param.time

      if (time) {
        // setPoint(param.point)
        isHoverChart.current = true
        const volumeSeriesData = volumeSeriesRef.current
          ? param.seriesData.get(volumeSeriesRef.current as ISeriesApi<'Histogram'>)
          : undefined
        const macdVolumeSeriesData = macdVolumeSeriesRef.current
          ? param.seriesData.get(macdVolumeSeriesRef.current as ISeriesApi<'Histogram'>)
          : undefined
        let chartData = candlestickSeriesRef.current
          ? param.seriesData.get(candlestickSeriesRef.current as ISeriesApi<'Candlestick'>)
          : null

        if (!chartData) {
          chartData = propsDataRef.current.filter(item => {
            return item.time === time
          })?.[0] as unknown as BarPrice
        }
        const smaLineArr: Array<number> = []
        smaLineRef.current?.forEach(item => {
          smaLineArr.push(param.seriesData.get(item as ISeriesApi<'Line'>)?.value)
        })

        const dif = difRef.current ? param.seriesData.get(difRef.current as ISeriesApi<'Line'>) : undefined
        const dea = deaRef.current ? param.seriesData.get(deaRef.current as ISeriesApi<'Line'>) : undefined

        setMaIndicator(smaLineArr)

        const buyAmount = ordersDataRef.current?.filter(item => {
          return item.ts.toString() === time.toString()
        })
        const tempObj: any = {}

        buyAmount?.forEach(item => {
          if (!tempObj[`${item.sideInd}`]) {
            tempObj[`${item.sideInd}`] = {
              ...item,
            }
          } else {
            tempObj[`${item.sideInd}`] = {
              ...tempObj[`${item.sideInd}`],
              amount: Number(item.amount) + Number(tempObj[`${item.sideInd}`].amount),
            }
          }
        })

        setMainK({
          time: dayjs(time as number).format('YYYY/MM/DD HH:mm'),
          open: chartData?.open,
          close: chartData?.close,
          high: chartData?.high,
          low: chartData?.low,
          isUp: checkIsUp(chartData),
          chg: calcChg(chartData, priceOffset),
          amp: calcAmp(chartData, priceOffset),
          buy: tempObj[tradeDirection.call]?.amount
            ? `${tempObj[tradeDirection.call]?.amount} ${tempObj[tradeDirection.call]?.currency}`
            : '',
          sell: tempObj[tradeDirection.put]?.amount
            ? `${tempObj[tradeDirection.put]?.amount} ${tempObj[tradeDirection.put]?.currency}`
            : '',
          overBuy: tempObj[tradeDirection.overCall]?.amount
            ? `${tempObj[tradeDirection.overCall]?.amount} ${tempObj[tradeDirection.overCall]?.currency}`
            : '',
          overSell: tempObj[tradeDirection.overPut]?.amount
            ? `${tempObj[tradeDirection.overPut]?.amount} ${tempObj[tradeDirection.overPut]?.currency}`
            : '',
          priceSpread: tempObj[tradeDirection.overCall]?.amplitude || tempObj[tradeDirection.overPut]?.amplitude,
        })

        setSubK({
          macd: macdVolumeSeriesData?.value,
          dea: dea?.value,
          dif: dif?.value,
        })

        setVolume({
          vol: volumeSeriesData?.value,
          quoteVolume: propsDataRef.current.filter(item => {
            return item.time === time
          })?.[0]?.quoteVolume as number,
          // (chartData as unknown as { quoteVolume: number }).quoteVolume,
          dir: chartData?.close > chartData?.open ? 'rise' : 'fall',
        })

        setBollK({
          mid: param.seriesData.get(bollRef.current?.mid as ISeriesApi<'Line'>)?.value,
          upper: param.seriesData.get(bollRef.current?.upper as ISeriesApi<'Line'>)?.value,
          lower: param.seriesData.get(bollRef.current?.lower as ISeriesApi<'Line'>)?.value,
        })

        setKdjK({
          k: param.seriesData.get(kdjRef.current?.k as ISeriesApi<'Line'>)?.value,
          d: param.seriesData.get(kdjRef.current?.d as ISeriesApi<'Line'>)?.value,
          j: param.seriesData.get(kdjRef.current?.j as ISeriesApi<'Line'>)?.value,
        })

        setRsiK({
          r: param.seriesData.get(rsiRef.current?.[0] as ISeriesApi<'Line'>)?.value,
          s: param.seriesData.get(rsiRef.current?.[1] as ISeriesApi<'Line'>)?.value,
          i: param.seriesData.get(rsiRef.current?.[2] as ISeriesApi<'Line'>)?.value,
        })

        const wrLineArr: Array<number> = []
        wrRef.current?.forEach(item => {
          wrLineArr.push(param.seriesData.get(item as ISeriesApi<'Line'>)?.value)
        })

        setWrK(wrLineArr)
      } else {
        // setPoint({ x: 0, y: 0 })
        isHoverChart.current = false
        if (outOfTimeValue.current) {
          setMaIndicator(outOfTimeValue.current._ma)

          setMainK(outOfTimeValue.current._mainK)

          setSubK(outOfTimeValue.current._subK)

          setBollK(outOfTimeValue.current._boll)

          setKdjK(outOfTimeValue.current._kdjK)

          setRsiK(outOfTimeValue.current._rsiK)

          setWrK(outOfTimeValue.current._wrK)

          setVolume(outOfTimeValue.current._volK)
        }
      }
    }
    chartRef.current.subscribeCrosshairMove(subscribeMoveChange)

    return () => {
      chartRef.current?.timeScale().unsubscribeVisibleTimeRangeChange(subscribeTimeChange)
      chartRef.current?.unsubscribeClick(param => {
        subscribeClickChange(param, markersRef, setPopVisible, props, priceOffset, setCurMarkers)
      })
      chartRef.current?.unsubscribeCrosshairMove(subscribeMoveChange)
      chartRef.current?.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged)
      // chartRef.current?.timeScale().unsubscribeSizeChange(sizeChange)
    }
  }, [])

  const getColorOfSetting = (close, open) => {
    if (colorsRef.current === UserUpsAndDownsColorEnum.greenUpRedDown) {
      return close > open ? 'rgba(80, 177, 108, 0.5)' : 'rgba(233, 90, 92, 0.5)'
    } else {
      return close > open ? 'rgba(233, 90, 92, 0.5)' : 'rgba(80, 177, 108, 0.5)'
    }
  }

  useImperativeHandle(ref, () => ({
    scrollToTime(marketChangesTime) {
      /** 跳转行情异动的 k 线柱子 */
      if (chartRef.current && propsDataRef.current?.length) {
        /** 库api 有bug,无法获取正确的位置，导致 scrollToPosition不可用 */
        const timeToCoordinate = chartRef.current?.timeScale().timeToCoordinate(marketChangesTime as Time)
        // console.log('getVisibleLogicalRange--------', chartRef.current?.timeScale().getVisibleLogicalRange())
        //   chartRef.current?.timeScale().scrollToPosition(timeToCoordinate as number, true)

        setTimeout(() => {
          chartRef.current?.timeScale().setVisibleRange({
            from: (curTimeRef.current.unit === 'm'
              ? marketChangesTime - 1000 * 60 * 120
              : marketChangesTime - 1000 * 60 * 60 * 120) as Time,
            to: curTimeRef.current.unit === 'm' ? marketChangesTime + 1000 * 60 : marketChangesTime + 1000 * 60 * 60,
          })
        })

        /** 跳转之后清空时间 */
        updateMarketChangesTime(0)
      }
    },
    updateCandlestickData(data, curRefData) {
      propsDataRef.current = curRefData || []

      candlestickSeriesRef.current?.update(data as CandlestickData)
      const temp = {
        ...data,
        time: dayjs(data.time).format('YYYY/MM/DD HH:mm'),
        isUp: checkIsUp(data),
        chg: calcChg(data, priceOffset),
        amp: calcAmp(data, priceOffset),
      }
      if (!isHoverChart.current) {
        setMainK(temp)
      }
      outOfTimeValue.current._mainK = temp
      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
      }
    },
    updateTimeData(data, curRefData) {
      propsDataRef.current = curRefData || []

      timeLineRef.current?.update(data)
      const temp = {
        ...data,
        time: dayjs(data.time).format('YYYY/MM/DD HH:mm'),
        isUp: checkIsUp(data),
        chg: calcChg(data, priceOffset),
        amp: calcAmp(data, priceOffset),
      }
      if (!isHoverChart.current) {
        setMainK(temp)
      }
      outOfTimeValue.current._mainK = temp
      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
      }
    },
    updateVolumeData(data) {
      if (subIndicatorRef.current?.vol?.select) {
        volumeSeriesRef.current?.update({
          ...data,
          // 'rgba(var(--buy_up_color), 0.5)' : 'rgba(var(--sell_down_color), 0.5)'
          color: getColorOfSetting(data.close, data.open),
        })
        const temp = {
          ...data,
          vol: data.value,
        }
        if (!isHoverChart.current) {
          setVolume(temp)
        }
        outOfTimeValue.current._volK = temp
      }
    },
    updateMaData() {
      if (mainIndicatorRef.current?.ma.select) {
        let _ma: Array<number> = []
        mainIndicatorRef.current?.ma.cur.forEach((item, index) => {
          if (item.select) {
            const { strip, type } = item

            let smaData = calculateSMA(propsDataRef.current, Number(strip), type, priceOffset)

            _ma.push(smaData[smaData.length - 1]?.value)
            smaData[smaData.length - 1]?.time &&
              smaLineRef.current?.[index]?.update(smaData[smaData.length - 1] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setMaIndicator(_ma)
        }
        outOfTimeValue.current._ma = _ma
      }
    },
    updateMacdData(data) {
      if (subIndicatorRef.current?.macd.select) {
        let _subK: SubKType = {
          dea: undefined,
          dif: undefined,
          macd: undefined,
        }
        const fast = (subIndicatorRef.current?.macd.cur.fast as CommonMainOrSubType).value
        const slow = (subIndicatorRef.current?.macd.cur.slow as CommonMainOrSubType).value
        const signal = (subIndicatorRef.current?.macd.cur.signal as CommonMainOrSubType).value

        const newData = calculateMACD(propsDataRef.current, Number(fast), Number(slow), Number(signal), priceOffset)

        _subK.dif = newData[newData.length - 1]?.dif
        _subK.dea = newData[newData.length - 1]?.dea
        _subK.macd = newData[newData.length - 1]?.value

        const difData =
          newData.map(item => {
            return {
              time: item.time,
              value: item.dif,
            }
          }) || []

        const deaData =
          newData.map(item => {
            return {
              time: item.time,
              value: item.dea,
            }
          }) || []

        const macdData =
          newData.map(item => {
            return {
              time: item?.time,
              value: item?.value,
              // color: item?.value < 0 ? props.createChart.downColor : props.createChart.upColor,
              color: getColorOfSetting(item?.value, 0),
            }
          }) || []
        const nameList = [difRef.current, deaRef.current, macdVolumeSeriesRef.current]
        const dataList = [difData[difData.length - 1], deaData[deaData.length - 1], macdData[macdData.length - 1]]
        subIndicator.macd.curLine?.forEach((item, index) => {
          if (item.select) {
            nameList[index]?.update(dataList[index] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setSubK(_subK)
          /** 悬浮时，离开悬浮时，更新ws展示 */
        }
        outOfTimeValue.current._subK = _subK
      }
    },
    updateBollData() {
      if (mainIndicatorRef.current?.boll.select) {
        let _boll: {
          mid: number
          upper: number
          lower: number
        } = {
          mid: 0,
          upper: 0,
          lower: 0,
        }
        const result = calBoll(
          propsDataRef.current,
          [
            Number((mainIndicatorRef.current?.boll.cur.mid as CommonMainOrSubType).value),
            Number((mainIndicatorRef.current?.boll.cur.std as CommonMainOrSubType).value),
          ],
          priceOffset
        )

        mainIndicatorRef.current?.boll.curLine?.forEach((item, index) => {
          if (item.select) {
            const _index = Object.keys(_boll)[index]
            _boll[_index] = result[result.length - 1][_index]
            const value =
              result.map(_item => {
                return {
                  value: _item[_index],
                  time: _item.time,
                }
              }) || []
            bollRef.current?.[_index].update(value[value.length - 1] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setBollK(_boll)
        }
        outOfTimeValue.current._boll = _boll
      }
    },
    updateKdjData() {
      if (subIndicatorRef.current?.kdj.select) {
        let _kdjK: {
          k: number
          d: number
          j: number
        } = {
          k: 0,
          d: 0,
          j: 0,
        }
        const result = calKdj(
          propsDataRef.current,
          [
            Number((subIndicatorRef.current?.kdj.cur.k as CommonMainOrSubType).value),
            Number((subIndicatorRef.current?.kdj.cur.d as CommonMainOrSubType).value),
            Number((subIndicatorRef.current?.kdj.cur.j as CommonMainOrSubType).value),
          ],
          priceOffset
        )

        subIndicatorRef.current?.kdj.curLine?.forEach((item, index) => {
          const _index = Object.keys(_kdjK)[index]
          if (item.select) {
            _kdjK[_index] = result[result.length - 1]?.[_index]
            const value =
              result.map(_item => {
                return {
                  value: _item[_index],
                  time: _item.time,
                }
              }) || []
            kdjRef.current?.[_index].update(value[value.length - 1] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setKdjK(_kdjK)
        }
        outOfTimeValue.current._kdjK = _kdjK
      }
    },
    updateRsiData() {
      if (subIndicatorRef.current?.rsi.select) {
        let _rsiK: {
          r: number
          s: number
          i: number
        } = {
          r: 0,
          s: 0,
          i: 0,
        }
        const result = calRsi(
          propsDataRef.current,
          [
            Number(subIndicatorRef.current?.rsi.cur[0].value),
            Number(subIndicatorRef.current?.rsi.cur[1].value),
            Number(subIndicatorRef.current?.rsi.cur[2].value),
          ],
          priceOffset
        )
        _rsiK.r = result[result.length - 1]?.r
        _rsiK.s = result[result.length - 1]?.s
        _rsiK.i = result[result.length - 1]?.i

        subIndicatorRef.current?.rsi.cur.forEach((_item, index) => {
          if (_item.select) {
            const value =
              result.map(item => {
                return {
                  value: item[Object.keys(_rsiK)[index]],
                  time: item.time,
                }
              }) || []
            rsiRef.current?.[index]?.update(value[value.length - 1] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setRsiK(_rsiK)
        }
        outOfTimeValue.current._rsiK = _rsiK
      }
    },
    updateWrData() {
      if (subIndicatorRef.current?.wr.select) {
        let _wrK: Array<number> = []

        subIndicatorRef.current?.wr.cur.forEach((_item, index) => {
          if (_item.select) {
            const result = calWr(
              propsDataRef.current,
              [Number(subIndicatorRef.current?.wr.cur[index].value)],
              [
                { key: 'wr1', title: 'wr1' },
                { key: 'wr2', title: 'wr2' },
              ],
              priceOffset
            )
            _wrK.push(result[result.length - 1]?.wr1)
            const value =
              result.map(item => {
                return {
                  value: item.wr1,
                  time: item.time,
                }
              }) || []
            wrRef.current?.[index]?.update(value[value.length - 1] as LineData)
          }
        })
        if (!isHoverChart.current) {
          setWrK(_wrK)
        }
        outOfTimeValue.current._wrK = _wrK
      }
    },
  }))

  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: containerRef.current?.clientWidth,
        height: containerRef.current?.clientHeight,
        rightPriceScale: {
          ...chartPropertySetting.rightPriceScale,
          scaleMargins: chartScaleMargins,
        },
      })

      setHeightChange(new Date().valueOf())

      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVisibleTimeRange(chartRef.current?.timeScale().getVisibleRange() as any)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    chartRef.current?.applyOptions({
      ...chartPropertySetting,
      layout: {
        ...props.chartLayoutOptions,
      },
      grid: {
        vertLines: {
          color: gridColor,
        },
        horzLines: {
          color: gridColor,
        },
      },
      rightPriceScale: {
        ...chartPropertySetting.rightPriceScale,
        scaleMargins: chartScaleMargins,
      },
    })
  }, [props.chartLayoutOptions.background, props.chartLayoutOptions.textColor])

  useEffect(() => {
    let _ma: Array<number> = []
    let _mainK: MainKType = {
      ...propsDataRef.current[propsDataRef.current.length - 1],
      time: dayjs(propsDataRef.current[propsDataRef.current.length - 1]?.time).format('YYYY/MM/DD HH:mm'),
      isUp: checkIsUp(propsDataRef.current[propsDataRef.current.length - 1]),
      chg: calcChg(propsDataRef.current[propsDataRef.current.length - 1], priceOffset),
      amp: calcAmp(propsDataRef.current[propsDataRef.current.length - 1], priceOffset),
    }

    let _subK: SubKType = {
      dea: undefined,
      dif: undefined,
      macd: undefined,
    }

    let _volK = {
      vol: propsDataRef.current[propsDataRef.current.length - 1]?.volume as number,
      quoteVolume: propsDataRef.current[propsDataRef.current.length - 1]?.quoteVolume as number,
      dir:
        propsDataRef.current[propsDataRef.current.length - 1]?.close >
        propsDataRef.current[propsDataRef.current.length - 1]?.open
          ? 'rise'
          : 'fall',
    }

    let _boll: {
      mid: number
      upper: number
      lower: number
    } = {
      mid: 0,
      upper: 0,
      lower: 0,
    }

    let _kdjK: {
      k: number
      d: number
      j: number
    } = {
      k: 0,
      d: 0,
      j: 0,
    }

    let _rsiK: {
      r: number
      s: number
      i: number
    } = {
      r: 0,
      s: 0,
      i: 0,
    }

    let _wrK: Array<number> = []

    if (chartRef.current) {
      if (!candlestickSeriesRef.current) {
        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: props?.createChart?.upColor || '#26a69a', // 涨
          downColor: props?.createChart?.downColor || '#ef5350', // 跌
          borderVisible: false,
          wickUpColor: props?.createChart?.upColor || '#26a69a',
          wickDownColor: props?.createChart?.downColor || '#ef5350',
          // priceScaleId: 'candledtick',
          ...chartPriceLineProperty,
          lastValueVisible: true,
          priceFormat: {
            minMove: 1 / 10 ** priceOffset,
          },
        } as DeepPartial<CandlestickStyleOptions>)
      }

      /* 清空操作,除了k线都需要清空 * */
      smaLineRef.current?.forEach(item => {
        item.setData([])
      })
      timeLineRef.current?.setData([])
      bollRef.current?.lower.setData([])
      bollRef.current?.mid.setData([])
      bollRef.current?.upper.setData([])
      difRef.current?.setData([])
      deaRef.current?.setData([])
      volumeSeriesRef.current?.setData([])
      macdVolumeSeriesRef.current?.setData([])
      kdjRef.current?.k.setData([])
      kdjRef.current?.d.setData([])
      kdjRef.current?.j.setData([])
      rsiRef.current?.forEach(item => {
        item.setData([])
      })
      wrRef.current?.forEach(item => {
        item.setData([])
      })

      markersRef.current = getMarkers(ordersKlineData, propsDataRef, props.createChart)
      buyMarkersRef.current = getBuyMarkers(ordersData, propsDataRef, props.createChart)

      if (props.curTime.unit === 'time' || props.curTime.unit === 's') {
        if (!timeLineRef.current) {
          timeLineRef.current = chartRef.current?.addLineSeries({
            color: props.createChart.brandColor,
            lineWidth: 1,
            lineStyle: LineStyle.Solid,
            ...chartPriceLineProperty,
            lastValueVisible: true,
          }) as ISeriesApi<'Line'>
        }
        timeLineRef.current.setData(
          propsDataRef.current.map(item => {
            return {
              ...item,
              value: item.close,
            }
          }) as unknown as LineData[]
        )
        candlestickSeriesRef.current.setData([])
        markersRef.current?.length &&
          timeLineRef.current.setMarkers(markersRef.current as unknown as SeriesMarker<Time>[])

        const oldData =
          timeLineRef.current?.markers()?.filter(item => {
            return item.id?.toString() === '1' || item.id?.toString() === '2'
          }) || []

        const preData: any =
          timeLineRef.current?.markers()?.filter(item => {
            return item.id?.toString() !== '1' && item.id?.toString() !== '2'
          }) || []

        const newList: any = []
        preData?.forEach(item => {
          buyMarkersRef.current?.forEach(_item => {
            if (
              item.id === _item.id &&
              item.statusCd === tradeStatus.processing &&
              _item.statusCd === tradeStatus.complete
            ) {
              const val = propsDataRef.current?.filter(childItem => {
                return childItem.time === _item.time
              })?.[0]?.close
              if (val) {
                const y = timeLineRef.current?.priceToCoordinate(val)
                const x = chartRef.current?.timeScale().timeToCoordinate(_item.time as Time)
                if (x && y) {
                  newList.push({
                    ..._item,
                    x,
                    y,
                  })
                }
              }
            }
          })
        })
        if (newList?.length) {
          //
          setTradeStatusOverList(
            newList.map(item => {
              return {
                ...item,
                loading: true,
              }
            })
          )
          timeLineRef.current?.setMarkers(
            oldData
              .concat(
                buyMarkersRef.current?.filter(item => {
                  return item.id !== newList[0].id
                }) || []
              )
              ?.sort?.((a, b) => {
                return Number(a.time) - Number(b.time)
              }) as unknown as SeriesMarker<Time>[]
          )
          setTimeout(() => {
            setTradeStatusOverList(newList)
            setTimeout(() => {
              setTradeStatusOverList([])
              timeLineRef.current?.setMarkers(
                oldData.concat(buyMarkersRef.current)?.sort?.((a, b) => {
                  return Number(a.time) - Number(b.time)
                }) as unknown as SeriesMarker<Time>[]
              )
            }, 1000)
          }, 500)
        } else {
          timeLineRef.current.setMarkers(
            oldData.concat(buyMarkersRef.current)?.sort?.((a, b) => {
              return Number(a.time) - Number(b.time)
            }) as unknown as SeriesMarker<Time>[]
          )
        }
      } else {
        candlestickSeriesRef.current.setData(propsDataRef.current as CandlestickData[])
        markersRef.current?.length &&
          candlestickSeriesRef.current.setMarkers(markersRef.current as unknown as SeriesMarker<Time>[])

        const oldData =
          candlestickSeriesRef.current?.markers()?.filter(item => {
            return item.id?.toString() === '1' || item.id?.toString() === '2'
          }) || []

        candlestickSeriesRef.current.setMarkers(
          oldData.concat(buyMarkersRef.current)?.sort?.((a, b) => {
            return Number(a.time) - Number(b.time)
          }) as unknown as SeriesMarker<Time>[]
        )
      }

      if (mainIndicator.boll.select) {
        if (!bollRef.current) {
          bollRef.current = {
            mid: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[0].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              ...chartPriceLineProperty,
            }),
            upper: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[1].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              ...chartPriceLineProperty,
            }),
            lower: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[2].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              ...chartPriceLineProperty,
            }),
          }
        }
        const result = calBoll(
          propsDataRef.current,
          [
            Number((mainIndicator.boll.cur.mid as CommonMainOrSubType).value),
            Number((mainIndicator.boll.cur.std as CommonMainOrSubType).value),
          ],
          priceOffset
        )

        mainIndicator.boll.curLine?.forEach((item, index) => {
          if (item.select) {
            const _index = Object.keys(_boll)[index]
            _boll[_index] = result[result.length - 1][_index]
            bollRef.current?.[_index].setData(
              result.map(_item => {
                return {
                  value: _item[_index],
                  time: _item.time,
                }
              }) as LineData[]
            )
          }
        })
      }

      if (mainIndicator.ma.select) {
        if (!smaLineRef.current) {
          const smaLineList: Array<ISeriesApi<'Line'>> = []
          mainIndicator.ma.cur.forEach(item => {
            const value = chartRef.current?.addLineSeries({
              color: item.color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              ...chartPriceLineProperty,
            }) as ISeriesApi<'Line'>
            smaLineList.push(value)
          })
          smaLineRef.current = smaLineList
        }

        mainIndicator.ma.cur.forEach((item, index) => {
          if (item.select) {
            const { strip, type } = item

            let smaData = calculateSMA(propsDataRef.current, Number(strip), type, priceOffset)
            _ma.push(smaData[smaData.length - 1]?.value)
            smaLineRef.current?.[index]?.setData(smaData as LineData[])
          }
        })
      }

      if (subIndicator.vol?.select) {
        if (!volumeSeriesRef.current) {
          volumeSeriesRef.current = chartRef.current?.addHistogramSeries({
            color: props.createChart.upColor,
            priceFormat: {
              type: 'price',
            },
            priceScaleId: 'vol',
            // scaleMargins: volScaleMargins,
            ...chartPriceLineProperty,
          }) as ISeriesApi<'Histogram'>
        }
        volumeSeriesRef.current.setData(
          propsDataRef.current.map(item => {
            return {
              time: item.time,
              value: item.volume,
              color: getColorOfSetting(item.close, item.open),
            }
          }) as HistogramData[]
        )
      }

      if (subIndicator.macd.select) {
        const fast = (subIndicator.macd.cur.fast as CommonMainOrSubType).value
        const slow = (subIndicator.macd.cur.slow as CommonMainOrSubType).value
        const signal = (subIndicator.macd.cur.signal as CommonMainOrSubType).value

        const newData = calculateMACD(propsDataRef.current, Number(fast), Number(slow), Number(signal), priceOffset)

        _subK.dif = newData[newData.length - 1]?.dif
        _subK.dea = newData[newData.length - 1]?.dea
        _subK.macd = newData[newData.length - 1]?.value

        const difData = newData.map(item => {
          return {
            time: item.time,
            value: item.dif,
          }
        })

        const deaData = newData.map(item => {
          return {
            time: item.time,
            value: item.dea,
          }
        })

        const macdData = newData.map(item => {
          return {
            time: item?.time,
            value: item?.value,
            color: getColorOfSetting(item?.value, 0),
          }
        })

        const subLineConfig = {
          color: props.createChart.brandColor,
          lineWidth: 1 as LineWidth,
          lineStyle: LineStyle.Solid,
          priceScaleId: 'volume',
          scaleMargins: macdScaleMargins,
          ...chartPriceLineProperty,
        }

        if (!difRef.current) {
          difRef.current = chartRef.current?.addLineSeries({
            ...subLineConfig,
            color: '#9660c4',
          }) as ISeriesApi<'Line'>
        }

        if (!deaRef.current) {
          deaRef.current = chartRef.current?.addLineSeries({
            ...subLineConfig,
            color: '#84aad5',
          }) as ISeriesApi<'Line'>
        }

        if (!macdVolumeSeriesRef.current) {
          macdVolumeSeriesRef.current = chartRef.current?.addHistogramSeries({
            color: props.createChart.upColor,
            priceFormat: {
              type: 'price',
            },
            priceScaleId: 'volume',
            // scaleMargins: macdScaleMargins,
            ...chartPriceLineProperty,
          }) as ISeriesApi<'Histogram'>
        }
        const nameList = [difRef.current, deaRef.current, macdVolumeSeriesRef.current]
        const dataList = [difData, deaData, macdData]
        subIndicator.macd.curLine?.forEach((item, index) => {
          if (item.select) {
            nameList[index].setData(dataList[index] as LineData[])
          }
        })
      }

      if (subIndicator.kdj.select) {
        if (!kdjRef.current) {
          kdjRef.current = {
            k: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[0].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              priceScaleId: 'kdj',
              // scaleMargins: kdjScaleMargins,
              ...chartPriceLineProperty,
            }),
            d: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[1].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              priceScaleId: 'kdj',
              // scaleMargins: kdjScaleMargins,
              ...chartPriceLineProperty,
            }),
            j: chartRef.current?.addLineSeries({
              color: mainIndicator.ma.cur[2].color,
              lineWidth: 1,
              lineStyle: LineStyle.Solid,
              priceScaleId: 'kdj',
              // scaleMargins: kdjScaleMargins,
              ...chartPriceLineProperty,
            }),
          }
        }
        const result = calKdj(
          propsDataRef.current,
          [
            Number((subIndicator.kdj.cur.k as CommonMainOrSubType).value),
            Number((subIndicator.kdj.cur.d as CommonMainOrSubType).value),
            Number((subIndicator.kdj.cur.j as CommonMainOrSubType).value),
          ],
          priceOffset
        )

        subIndicator.kdj.curLine?.forEach((item, index) => {
          const _index = Object.keys(_kdjK)[index]
          if (item.select) {
            _kdjK[_index] = result[result.length - 1]?.[_index]
            kdjRef.current?.[_index].setData(
              result.map(_item => {
                return {
                  value: _item[_index],
                  time: _item.time,
                }
              }) as LineData[]
            )
          }
        })
      }

      if (subIndicator.rsi.select) {
        if (!rsiRef.current) {
          const rsiList: Array<ISeriesApi<'Line'>> = []
          subIndicator.rsi.cur.forEach(item => {
            rsiList.push(
              chartRef.current?.addLineSeries({
                color: item.color,
                lineWidth: 1,
                lineStyle: LineStyle.Solid,
                priceScaleId: 'rsi',
                // scaleMargins: rsiScaleMargins,
                ...chartPriceLineProperty,
              }) as ISeriesApi<'Line'>
            )
          })
          rsiRef.current = rsiList
        }
        const result = calRsi(
          propsDataRef.current,
          [
            Number(subIndicator.rsi.cur[0].value),
            Number(subIndicator.rsi.cur[1].value),
            Number(subIndicator.rsi.cur[2].value),
          ],
          priceOffset
        )

        _rsiK.r = result[result.length - 1]?.r
        _rsiK.s = result[result.length - 1]?.s
        _rsiK.i = result[result.length - 1]?.i

        subIndicator.rsi.cur.forEach((_item, index) => {
          if (_item.select) {
            rsiRef.current?.[index]?.setData(
              result.map(item => {
                return {
                  value: item[Object.keys(_rsiK)[index]],
                  time: item.time,
                }
              }) as LineData[]
            )
          }
        })
      }

      if (subIndicator.wr.select) {
        if (!wrRef.current) {
          const wrList: Array<ISeriesApi<'Line'>> = []
          subIndicator.wr.cur.forEach(item => {
            wrList.push(
              chartRef.current?.addLineSeries({
                color: item.color,
                lineWidth: 1,
                lineStyle: LineStyle.Solid,
                priceScaleId: 'wr',
                // scaleMargins: wrScaleMargins,
                ...chartPriceLineProperty,
              }) as ISeriesApi<'Line'>
            )
          })
          wrRef.current = wrList
        }
        subIndicator.wr.cur.forEach((_item, index) => {
          const result = calWr(
            propsDataRef.current,
            [Number(subIndicator.wr.cur[index].value)],
            [
              { key: 'wr1', title: 'wr1' },
              { key: 'wr2', title: 'wr2' },
            ],
            priceOffset
          )

          _wrK.push(result[result.length - 1]?.wr1)

          if (_item.select) {
            wrRef.current?.[index]?.setData(
              result.map(item => {
                return {
                  value: item.wr1,
                  time: item.time,
                }
              }) as LineData[]
            )
          }
        })
      }

      setMaIndicator(_ma)
      setMainK(_mainK)
      setSubK(_subK)
      setBollK(_boll)
      setKdjK(_kdjK)
      setRsiK(_rsiK)
      setWrK(_wrK)
      setVolume(_volK)
      outOfTimeValue.current = {
        _ma,
        _mainK,
        _subK,
        _boll,
        _kdjK,
        _rsiK,
        _wrK,
        _volK,
      }
    }
  }, [mainIndicator, subIndicator, chartRef.current, ordersKlineData, ordersData, props.getDataAndUpdateChart, colors])

  useEffect(() => {
    /** 红涨绿跌，红跌绿涨 */
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.applyOptions({
        // scaleMargins: chartScaleMargins,
        upColor: props?.createChart?.upColor || '#26a69a', // 涨
        downColor: props?.createChart?.downColor || '#ef5350', // 跌
        wickUpColor: props?.createChart?.upColor || '#26a69a',
        wickDownColor: props?.createChart?.downColor || '#ef5350',
      })
      candlestickSeriesRef.current.priceScale().applyOptions({
        scaleMargins: chartScaleMargins,
      })
    }

    if (timeLineRef.current) {
      timeLineRef.current.priceScale().applyOptions({
        scaleMargins: chartScaleMargins,
      })
    }

    if (smaLineRef.current) {
      smaLineRef.current.forEach(item => {
        item.priceScale().applyOptions({
          scaleMargins: chartScaleMargins,
        })
      })
    }

    if (difRef.current) {
      difRef.current.priceScale().applyOptions({
        scaleMargins: macdScaleMargins,
      })
    }

    if (deaRef.current) {
      deaRef.current.priceScale().applyOptions({
        scaleMargins: macdScaleMargins,
      })
    }

    if (macdVolumeSeriesRef.current) {
      macdVolumeSeriesRef.current.priceScale().applyOptions({
        scaleMargins: macdScaleMargins,
      })
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.priceScale().applyOptions({
        scaleMargins: volScaleMargins,
      })
    }

    if (bollRef.current) {
      bollRef.current.mid.priceScale().applyOptions({
        scaleMargins: chartScaleMargins,
      })
      bollRef.current.upper.priceScale().applyOptions({
        scaleMargins: chartScaleMargins,
      })
      bollRef.current.lower.priceScale().applyOptions({
        scaleMargins: chartScaleMargins,
      })
    }

    if (kdjRef.current) {
      kdjRef.current.k.priceScale().applyOptions({
        scaleMargins: kdjScaleMargins,
      })
      kdjRef.current.d.priceScale().applyOptions({
        scaleMargins: kdjScaleMargins,
      })
      kdjRef.current.j.priceScale().applyOptions({
        scaleMargins: kdjScaleMargins,
      })
    }

    if (rsiRef.current) {
      rsiRef.current.forEach(item => {
        item.priceScale().applyOptions({
          scaleMargins: rsiScaleMargins,
        })
      })
    }

    if (wrRef.current) {
      wrRef.current.forEach(item => {
        item.priceScale().applyOptions({
          scaleMargins: wrScaleMargins,
        })
      })
    }
  }, [heightChange, subIndicator, colors])

  const [expand, setExpand] = useState({
    mainK: true,
    vol: true,
    ma: true,
    boll: true,
    macd: true,
    kdj: true,
    rsi: true,
    wr: true,
  })

  /** 展开title */
  const expandClick = key => {
    setExpand({
      ...expand,
      [key]: !expand[key],
    })
  }

  /** 展示订单详情 */
  const showOrderDetail = (type, e) => {
    e.stopPropagation()
    if (type === 'buy') {
      setTableData(curMarkers?.buyData as MarkersType[])
    } else {
      setTableData(curMarkers?.sellData as MarkersType[])
    }
    setModalVisible(true)
  }

  return (
    <KLineRender
      curTime={props.curTime}
      mainIndicator={mainIndicator}
      subIndicator={subIndicator}
      createChart={props.createChart}
      locale={props.locale}
      ordersKlineData={ordersKlineData}
      expandIcon={props.expandIcon}
      expand={expand}
      expandClick={expandClick}
      mainK={mainK as MainKType}
      maIndicator={maIndicator as number[]}
      bollK={bollK}
      macdScaleMargins={macdScaleMargins}
      subK={subK}
      volume={volume}
      kdjScaleMargins={kdjScaleMargins}
      kdjK={kdjK}
      rsiScaleMargins={rsiScaleMargins}
      rsiK={rsiK}
      wrScaleMargins={wrScaleMargins}
      containerRef={containerRef}
      curMaxAndMinPoint={curMaxAndMinPoint}
      curBuyAndSellPoint={curBuyAndSellPoint}
      wrK={wrK}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      tableData={tableData}
      popVisible={popVisible}
      curMarkers={curMarkers as CurMarkersType}
      showOrderDetail={showOrderDetail}
      volScaleMargins={volScaleMargins}
      coinInfo={props.coinInfo}
      priceOffset={priceOffset}
      chartSettingIcon={chartSettingIcon}
      // point={point}
      allChartRef={{
        candlestickSeriesRef: candlestickSeriesRef.current,
        timeLineRef: timeLineRef.current,
        smaLineRef: smaLineRef.current,
        difRef: difRef.current,
        deaRef: deaRef.current,
        macdVolumeSeriesRef: macdVolumeSeriesRef.current,
        volumeSeriesRef: volumeSeriesRef.current,
        bollRef: bollRef.current,
        kdjRef: kdjRef.current,
        rsiRef: rsiRef.current,
        wrRef: wrRef.current,
      }}
      updateMainIndicator={props.updateMainIndicator}
      updateSubIndicator={props.updateSubIndicator}
      modalRef={props.modalRef}
      optionBuyCallback={optionBuyCallback}
      optionSellCallback={optionSellCallback}
      optionIcon={optionIcon}
      optionActiveTab={optionActiveTab}
      countDownComponent={countDownComponent}
      tradeRestSecond={tradeRestSecond}
      tradeStatusOverList={tradeStatusOverList}
      optionAnimation={optionAnimation}
    />
  )
}

export default forwardRef(KLineChart)
