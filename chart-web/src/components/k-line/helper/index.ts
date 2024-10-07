import { MarkersType } from '@nbit/chart-utils'
import { Time } from '@nbit/lightweight-charts'

export const tradeDirection = {
  call: 'call',
  put: 'put',
  /** 涨超 */
  overCall: 'over_call',
  /** 跌超 */
  overPut: 'over_put',
}

export const tradeStatus = {
  processing: 'processing',
  revoke: 'revoke',
  /** 涨超 */
  complete: 'complete',
  /** 跌超 */
  fail: 'fail',
}

/** 订阅图表点击事件 */
export const subscribeClickChange = (param, markersRef, setPopVisible, props, priceOffset, setCurMarkers) => {
  // console.log('param---------', param)

  if (!param.point || !param.hoveredMarkerId || !markersRef.current?.length) {
    setPopVisible(false)

    return
  }

  const findTime = markersRef.current.filter(item => {
    return Number(item.id) === Number(param.hoveredMarkerId)
  })

  const buyData: Array<MarkersType> = []
  const sellData: Array<MarkersType> = []
  markersRef.current.forEach(item => {
    if (item.time === findTime?.[0]?.time) {
      if (item.color === props.createChart.upColor) {
        buyData.push(item)
      } else {
        sellData.push(item)
      }
    }
  })

  const _curMarkers = {
    x: param.point.x,
    y: param.point.y,
    buyData,
    sellData,
    buyDetail: {
      total: buyData?.length,
      avg: Number(
        (
          (buyData?.reduce((init, item) => {
            return init + item.price
          }, 0) || 0) / (buyData?.length || 1)
        ).toFixed(priceOffset)
      ),
      count: buyData?.reduce((init, item) => {
        return init + item.count
      }, 0),
    },
    sellDetail: {
      total: sellData?.length,
      avg: Number(
        (
          (sellData?.reduce((init, item) => {
            return init + item.price
          }, 0) || 0) / (sellData?.length || 1)
        ).toFixed(priceOffset)
      ),
      count: sellData?.reduce((init, item) => {
        return init + item.count
      }, 0),
    },
  }
  setCurMarkers(_curMarkers)
  if (buyData?.length || sellData?.length) {
    setPopVisible(true)
  }
  // console.log('param---------', _curMarkers)
}

export interface SubKType {
  dea: number | undefined
  dif: number | undefined
  macd: number | undefined
}

type SN = string | number

export interface MainKType {
  time: SN
  open: SN
  high: SN
  low: SN
  close: SN
  isUp: boolean
  chg: SN
  amp: SN
  buy?: SN
  sell?: SN
  overBuy?: SN
  overSell?: SN
  priceSpread?: SN
}

/** 计算图表指标位置 */
export const calChartIndicatorPositon = subIndicator => {
  /** 指标在图表中的位置计算 */
  let selectNum = 0
  let chartScaleMargins = {
    top: 0.12,
    bottom: 0.01,
  }
  let volScaleMargins = {
    top: 0,
    bottom: 0,
  }
  let macdScaleMargins = {
    top: 0,
    bottom: 0,
  }
  let kdjScaleMargins = {
    top: 0,
    bottom: 0,
  }
  let rsiScaleMargins = {
    top: 0,
    bottom: 0,
  }
  let wrScaleMargins = {
    top: 0,
    bottom: 0,
  }

  for (let i in subIndicator) {
    if (subIndicator[i]?.select) {
      selectNum += 1
    }
  }

  if (selectNum) {
    chartScaleMargins = {
      top: 0.12,
      /** 0.08 2个图表之间的间隔 */
      bottom: 0.01 + selectNum * 0.16 + 0.02,
    }

    if (subIndicator.vol?.select) {
      volScaleMargins = {
        top: 1 - (chartScaleMargins.bottom - 0.02) + 0.06,
        bottom: chartScaleMargins.bottom - 0.02 - 0.16,
      }
    } else {
      volScaleMargins = chartScaleMargins
    }

    if (subIndicator.macd?.select) {
      macdScaleMargins = {
        top: 1 - volScaleMargins.bottom + 0.06,
        bottom: volScaleMargins.bottom - 0.16,
      }
    } else {
      macdScaleMargins = volScaleMargins
    }

    if (subIndicator.kdj?.select) {
      kdjScaleMargins = {
        top: 1 - macdScaleMargins.bottom + 0.06,
        bottom: macdScaleMargins.bottom - 0.16,
      }
    } else {
      kdjScaleMargins = macdScaleMargins
    }

    if (subIndicator.rsi?.select) {
      rsiScaleMargins = {
        top: 1 - kdjScaleMargins.bottom + 0.06,
        bottom: kdjScaleMargins.bottom - 0.16,
      }
    } else {
      rsiScaleMargins = kdjScaleMargins
    }

    if (subIndicator.wr?.select) {
      wrScaleMargins = {
        top: 1 - rsiScaleMargins.bottom + 0.06,
        bottom: rsiScaleMargins.bottom - 0.16,
      }
    } else {
      wrScaleMargins = rsiScaleMargins
    }
  }
  // console.log('subIndicator', subIndicator)
  // console.log('selectNum', selectNum)
  // console.log('chartScaleMargins', chartScaleMargins)
  // console.log('volScaleMargins', volScaleMargins)
  // console.log('macdScaleMargins', macdScaleMargins)
  // console.log('kdjScaleMargins', kdjScaleMargins)
  // console.log('rsiScaleMargins', rsiScaleMargins)

  return {
    chartScaleMargins,
    volScaleMargins,
    macdScaleMargins,
    kdjScaleMargins,
    rsiScaleMargins,
    wrScaleMargins,
  }
}

export const calHeightAndLowPoint = (
  visibleTimeRange,
  curTimeRef,
  propsDataRef,
  timeLineRef,
  candlestickSeriesRef,
  chartRef,
  setCurMaxAndMinPoint,
  createChart,
  priceOffset
) => {
  if (!visibleTimeRange.from || !visibleTimeRange.to) {
    return
  }
  const { from, to } = visibleTimeRange
  const maxAndMinPoint = {
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
  }

  const curRef =
    curTimeRef.current.unit === 'time' || curTimeRef.current.unit === 's'
      ? timeLineRef.current
      : candlestickSeriesRef.current
  if (curTimeRef.current.unit === 'time' || curTimeRef.current.unit === 's') {
    propsDataRef.current?.forEach(item => {
      if (from === item.time) {
        maxAndMinPoint.max.value = item.close
        maxAndMinPoint.max.time = item.time
        maxAndMinPoint.min.value = item.close
        maxAndMinPoint.min.time = item.time
      } else if (from < item.time && item.time <= to) {
        if (item.close > maxAndMinPoint.max.value) {
          maxAndMinPoint.max.value = item.close
          maxAndMinPoint.max.time = item.time
        }
        if (item.close < maxAndMinPoint.min.value) {
          maxAndMinPoint.min.value = item.close
          maxAndMinPoint.min.time = item.time
        }
      }
    })
  } else {
    propsDataRef.current?.forEach(item => {
      if (from === item.time) {
        maxAndMinPoint.max.value = item.high
        maxAndMinPoint.max.time = item.time
        maxAndMinPoint.min.value = item.low
        maxAndMinPoint.min.time = item.time
      } else if (from < item.time && item.time <= to) {
        if (item.high > maxAndMinPoint.max.value) {
          maxAndMinPoint.max.value = item.high
          maxAndMinPoint.max.time = item.time
        }
        if (item.low < maxAndMinPoint.min.value) {
          maxAndMinPoint.min.value = item.low
          maxAndMinPoint.min.time = item.time
        }
      }
    })
  }

  maxAndMinPoint.max.y = curRef?.priceToCoordinate(maxAndMinPoint.max.value) as number
  maxAndMinPoint.min.y = curRef?.priceToCoordinate(maxAndMinPoint.min.value) as number
  maxAndMinPoint.max.x = chartRef.current?.timeScale().timeToCoordinate(maxAndMinPoint.max.time as Time) as number
  maxAndMinPoint.min.x = chartRef.current?.timeScale().timeToCoordinate(maxAndMinPoint.min.time as Time) as number

  maxAndMinPoint.min.value = Number(maxAndMinPoint.min.value).toFixed(priceOffset) as unknown as number
  maxAndMinPoint.max.value = Number(maxAndMinPoint.max.value).toFixed(priceOffset) as unknown as number

  const isMac = navigator?.userAgent?.toLowerCase()?.indexOf('mac') !== -1
  const calcMin = isMac
    ? ((maxAndMinPoint.min.value?.toString().length || 0) + 2) * 2
    : ((maxAndMinPoint.min.value?.toString().length || 0) + 2) * 2 - 2
  const calcMax = isMac
    ? ((maxAndMinPoint.max.value?.toString().length || 0) + 2) * 2
    : ((maxAndMinPoint.max.value?.toString().length || 0) + 2) * 2 - 2
  let minBlank = ''
  let maxBlank = ''
  for (let i = 0; i < calcMin; i += 1) {
    minBlank += ' '
  }

  for (let i = 0; i < calcMax; i += 1) {
    maxBlank += ' '
  }
  let markers = [
    {
      time: maxAndMinPoint.min.time,
      position: 'belowBar',
      color: createChart.textColor01,
      shape: 'arrowUp',
      text:
        maxAndMinPoint.min.x < 80
          ? `${minBlank}一 ${maxAndMinPoint.min.value}`
          : `${maxAndMinPoint.min.value} 一${minBlank}`,
      id: 1,
      size: 0,
    },
  ]
  if (maxAndMinPoint.max.value !== maxAndMinPoint.min.value) {
    markers = [
      {
        time: maxAndMinPoint.min.time,
        position: 'belowBar',
        color: createChart.textColor01,
        shape: 'arrowUp',
        text:
          maxAndMinPoint.min.x < 80
            ? `${minBlank}一 ${maxAndMinPoint.min.value}`
            : `${maxAndMinPoint.min.value} 一${minBlank}`,
        id: 1,
        size: 0,
      },
      {
        time: maxAndMinPoint.max.time,
        position: 'aboveBar',
        color: createChart.textColor01,
        shape: 'arrowUp',
        text:
          maxAndMinPoint.max.x < 80
            ? `${maxBlank}一 ${maxAndMinPoint.max.value}`
            : `${maxAndMinPoint.max.value} 一${maxBlank}`,
        id: 2,
        size: 0,
      },
    ]
  }

  const oldData =
    curRef?.markers()?.filter(item => {
      return item.id?.toString() !== '1' && item.id?.toString() !== '2'
    }) || []

  curRef?.setMarkers(
    oldData.concat(markers)?.sort((a, b) => {
      return a.time - b.time
    })
  )
  // setCurMaxAndMinPoint(maxAndMinPoint)
}

export const calQuickBuyAndSellPoint = (
  visibleTimeRange,
  curTimeRef,
  propsDataRef,
  timeLineRef,
  candlestickSeriesRef,
  chartRef,
  setCurBuyAndSellPoint,
  createChart,
  priceOffset
) => {
  if (!visibleTimeRange.from || !visibleTimeRange.to) {
    return
  }
  const { from, to } = visibleTimeRange
  const maxAndMinPoint = {
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
  }

  const curRef =
    curTimeRef.current.unit === 'time' || curTimeRef.current.unit === 's'
      ? timeLineRef.current
      : candlestickSeriesRef.current
  if (curTimeRef.current.unit === 'time' || curTimeRef.current.unit === 's') {
    propsDataRef.current?.forEach(item => {
      maxAndMinPoint.max.value = item.close
      maxAndMinPoint.max.time = item.time
      maxAndMinPoint.min.value = item.close
      maxAndMinPoint.min.time = item.time
    })
  } else {
    propsDataRef.current?.forEach(item => {
      maxAndMinPoint.max.value = item.high
      maxAndMinPoint.max.time = item.time
      maxAndMinPoint.min.value = item.low
      maxAndMinPoint.min.time = item.time
    })
  }

  if (maxAndMinPoint.max.time > to) {
    setCurBuyAndSellPoint({
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
    return
  }
  maxAndMinPoint.max.y = curRef?.priceToCoordinate(maxAndMinPoint.max.value) as number
  maxAndMinPoint.min.y = curRef?.priceToCoordinate(maxAndMinPoint.min.value) as number
  maxAndMinPoint.max.x = chartRef.current?.timeScale().timeToCoordinate(maxAndMinPoint.max.time as Time) as number
  maxAndMinPoint.min.x = chartRef.current?.timeScale().timeToCoordinate(maxAndMinPoint.min.time as Time) as number

  maxAndMinPoint.min.value = Number(maxAndMinPoint.min.value).toFixed(priceOffset) as unknown as number
  maxAndMinPoint.max.value = Number(maxAndMinPoint.max.value).toFixed(priceOffset) as unknown as number

  // console.log('maxAndMinPoint', maxAndMinPoint)
  setCurBuyAndSellPoint(maxAndMinPoint)
}

/** 获取买卖点 */
export const getMarkers = (ordersKlineData, propsDataRef, createChart) => {
  let markers: Array<MarkersType> = []

  for (let i = 0; i < ordersKlineData?.length; i += 1) {
    for (let j = 0; j < (ordersKlineData[i]?.transactionLogs || [])?.length; j += 1) {
      for (let k = 0; k < propsDataRef.current?.length; k += 1) {
        if (ordersKlineData[i].side === 1) {
          if (
            Number(ordersKlineData[i]?.transactionLogs?.[j]?.createdByTime) === propsDataRef.current[k].time ||
            (Number(ordersKlineData[i]?.transactionLogs?.[j].createdByTime) > propsDataRef.current[k].time &&
              Number(ordersKlineData[i]?.transactionLogs?.[j].createdByTime) < propsDataRef.current[k + 1]?.time)
          ) {
            markers.push({
              time: propsDataRef.current[k]?.time,
              position: 'belowBar',
              color: createChart.upColor,
              shape: 'arrowUp',
              text: 'B',
              id: k,
              price: ordersKlineData[i]?.transactionLogs?.[j].price as number,
              count: ordersKlineData[i]?.transactionLogs?.[j].count as number,
              fees: ordersKlineData[i]?.transactionLogs?.[j].fees as number,
            })
            break
          }
        } else {
          if (
            Number(ordersKlineData[i]?.transactionLogs?.[j]?.createdByTime) === propsDataRef.current[k]?.time ||
            (Number(ordersKlineData[i]?.transactionLogs?.[j].createdByTime) > propsDataRef.current[k]?.time &&
              Number(ordersKlineData[i]?.transactionLogs?.[j].createdByTime) < propsDataRef.current[k + 1]?.time)
          ) {
            markers.push({
              time: propsDataRef.current[k]?.time,
              position: 'aboveBar',
              color: createChart.downColor,
              shape: 'arrowDown',
              text: 'S',
              id: k,
              price: ordersKlineData[i]?.transactionLogs?.[j].price as number,
              count: ordersKlineData[i]?.transactionLogs?.[j].count as number,
              fees: ordersKlineData[i]?.transactionLogs?.[j].fees as number,
            })
            break
          }
        }
      }
    }
  }

  let temp = {}
  markers?.forEach(item => {
    if (!temp[item.time]) {
      temp[item.time] = 0
    } else {
      temp[item.time] += 1
    }
  })
  markers = markers?.map(item => {
    if (temp[item.time]) {
      return {
        ...item,
        color: createChart.brandColor,
        shape: 'circle',
        text: 'T',
      }
    }
    return item
  })

  return markers
}

/** 获取三元期权买点 */
export const getBuyMarkers = (ordersData, propsDataRef, createChart) => {
  let markers: Array<MarkersType | any> = []
  const tempObj: any = {}
  ordersData?.forEach(item => {
    if (!tempObj[`${item.ts}${item.sideInd}`]) {
      tempObj[`${item.ts}${item.sideInd}`] = {
        ...item,
      }
    } else {
      tempObj[`${item.ts}${item.sideInd}`] = {
        ...tempObj[`${item.ts}${item.sideInd}`],
        amount: Number(item.amount) + Number(tempObj[`${item.ts}${item.sideInd}`].amount),
      }
    }
  })
  Object.keys(tempObj)?.forEach(item => {
    if (tempObj[item].sideInd === tradeDirection.call) {
      markers.push({
        time: tempObj[item].ts,
        position: 'aboveBar',
        statusCd: tempObj[item].statusCd,
        realizedProfit: Number(tempObj[item].realizedProfit),
        color:
          tempObj[item].statusCd === tradeStatus.processing
            ? '#FFFFFF'
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.upColor
            : createChart.textColor02,
        bgColor:
          tempObj[item].statusCd === tradeStatus.processing
            ? createChart.upColor
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.upSpecialColor02
            : createChart.cardBgColor02,
        shape: 'arrowNormalUp',
        text: '',
        id: `${tempObj[item].ts}${tempObj[item].sideInd}`,
        sideInd: tempObj[item].sideInd,
        size: 1,
        price: tempObj[item].amount,
        count: tempObj[item].currency,
        fees: 0,
      })
    } else if (tempObj[item].sideInd === tradeDirection.put) {
      markers.push({
        time: tempObj[item].ts,
        position: 'belowBar',
        statusCd: tempObj[item].statusCd,
        realizedProfit: Number(tempObj[item].realizedProfit),
        color:
          tempObj[item].statusCd === tradeStatus.processing
            ? '#FFFFFF'
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.downColor
            : createChart.textColor02,
        bgColor:
          tempObj[item].statusCd === tradeStatus.processing
            ? createChart.downColor
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.downSpecialColor02
            : createChart.cardBgColor02,
        shape: 'arrowNormalDown',
        text: '',
        id: `${tempObj[item].ts}${tempObj[item].sideInd}`,
        sideInd: tempObj[item].sideInd,
        size: 1,
        price: tempObj[item].amount,
        count: tempObj[item].currency,
        fees: 0,
      })
    } else if (tempObj[item].sideInd === tradeDirection.overCall) {
      markers.push({
        time: tempObj[item].ts,
        position: 'aboveBar',
        statusCd: tempObj[item].statusCd,
        realizedProfit: Number(tempObj[item].realizedProfit),
        color:
          tempObj[item].statusCd === tradeStatus.processing
            ? '#FFFFFF'
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.upColor
            : createChart.textColor02,
        bgColor:
          tempObj[item].statusCd === tradeStatus.processing
            ? createChart.upColor
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.upSpecialColor02
            : createChart.cardBgColor02,
        shape: 'arrowOptionUp',
        text: '',
        id: `${tempObj[item].ts}${tempObj[item].sideInd}`,
        sideInd: tempObj[item].sideInd,
        size: 1,
        price: tempObj[item].amount,
        count: tempObj[item].currency,
        fees: 0,
      })
    } else if (tempObj[item].sideInd === tradeDirection.overPut) {
      markers.push({
        time: tempObj[item].ts,
        position: 'belowBar',
        statusCd: tempObj[item].statusCd,
        realizedProfit: Number(tempObj[item].realizedProfit),
        color:
          tempObj[item].statusCd === tradeStatus.processing
            ? '#FFFFFF'
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.downColor
            : createChart.textColor02,
        bgColor:
          tempObj[item].statusCd === tradeStatus.processing
            ? createChart.downColor
            : Number(tempObj[item].realizedProfit) > 0
            ? createChart.downSpecialColor02
            : createChart.cardBgColor02,
        shape: 'arrowOptionDown',
        text: '',
        id: `${tempObj[item].ts}${tempObj[item].sideInd}`,
        sideInd: tempObj[item].sideInd,
        size: 1,
        price: tempObj[item].amount,
        count: tempObj[item].currency,
        fees: 0,
      })
    }
  })

  return markers
}

export const numFormat = (num, digits) => {
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
  ]
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i -= 1) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}
