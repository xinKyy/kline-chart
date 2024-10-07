import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, LineStyle, SingleValueData, Time } from '@nbit/lightweight-charts'
import { DeptChartData, DeptChartPropsType, ThemeEnum } from '@nbit/chart-utils'

enum TradeDirectionEnum {
  Buy = 'buy',
  Sell = 'sell',
}

/** 涨跌色 */
export enum UserUpsAndDownsColorEnum {
  greenUpRedDown = 1, // 绿涨红跌
  redUpGreenDown = 2, // 红涨绿跌
}

function DeptRealChart(props: DeptChartPropsType & { theme: string } & { priceOffset: number } & { colors: number }) {
  const { priceOffset, colors } = props
  const leftDeptRef = useRef<ISeriesApi<'Area'> | null>(null)
  const centerDeptRef = useRef<ISeriesApi<'Line'> | null>(null)
  const rightDeptRef = useRef<ISeriesApi<'Area'> | null>(null)
  const deptRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const floatTooltip = useRef<HTMLDivElement | null>(null)
  const gridColor = props.theme === ThemeEnum.light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'
  const leftDataRef = useRef<DeptChartData[]>([])
  const rightDataRef = useRef<DeptChartData[]>([])
  const [centerVerLine, setCenterVerLine] = useState({
    x: 0,
  })

  const colorRef = useRef(props.createChart)

  useEffect(() => {
    colorRef.current = props.createChart
  }, [props.createChart])

  const chartPriceLineProperty = {
    crosshairMarkerVisible: false,
    baseLineVisible: false,
    priceLineVisible: false,
    lastValueVisible: false,
  }

  const chartPropertySetting = {
    layout: props.chartLayoutOptions,
    localization: {
      timeFormatter: item => {
        return item
      },
    },
    // 时间刻度和价格刻度
    timeScale: {
      borderColor: gridColor,
      // borderVisible: true,
      // fixLeftEdge: true,
      // lockVisibleTimeRangeOnResize: true,
      // fixRightEdge: true,
      barSpacing: 6,
      tickMarkFormatter: time => {
        // if (xCoordinateDataRef.current.indexOf(time) !== -1) {
        //   return time
        // }
        // if (Number(time) % 1 === 0) {
        //   return ''
        // }
        return time.toFixed(priceOffset)
      },
    },

    rightPriceScale: {
      borderColor: gridColor,
    },
  }

  useEffect(() => {
    chartRef.current?.applyOptions({
      // ...chartPropertySetting,
      layout: props.chartLayoutOptions,
      // 时间刻度和价格刻度
      grid: {
        vertLines: {
          color: gridColor,
        },
        horzLines: {
          color: gridColor,
        },
      },
    })
  }, [props.chartLayoutOptions.background, props.chartLayoutOptions.textColor])

  useEffect(() => {
    if (floatTooltip.current) {
      floatTooltip.current.style.background = props.createChart.cardBgColor03 as string
      floatTooltip.current.style.color = props.createChart.textColor01 as string
    }
  }, [props.createChart.cardBgColor03, props.createChart.textColor01])

  const setVerLineChart = () => {
    if (!leftDataRef.current?.length && !rightDataRef.current?.length) {
      return
    }
    requestAnimationFrame(() => {
      const verPoint = {
        x: 0,
      }

      const leftX =
        chartRef.current
          ?.timeScale()
          .timeToCoordinate(leftDataRef.current[leftDataRef.current.length - 1]?.time as Time) || 0

      const rightX =
        (chartRef.current?.timeScale().timeToCoordinate(rightDataRef.current[0]?.time as Time) as number) || 0

      verPoint.x = leftX + (rightX - leftX) / 2

      setCenterVerLine(verPoint)
    })
  }

  const dealData = data => {
    const leftData: Array<DeptChartData> = []
    const rightData: Array<DeptChartData> = []

    data.forEach(item => {
      if (item.direction === TradeDirectionEnum.Buy) {
        leftData.push(item)
      }
      if (item.direction === TradeDirectionEnum.Sell) {
        rightData.push(item)
      }
    })

    leftDeptRef.current?.setData(leftData as SingleValueData[])
    rightDeptRef.current?.setData(rightData as SingleValueData[])
    leftDataRef.current = leftData
    rightDataRef.current = rightData

    setVerLineChart()

    chartRef.current?.timeScale().fitContent()
  }

  useEffect(() => {
    if (!props.data?.length || !leftDeptRef.current || !rightDeptRef.current || !chartRef.current) {
      return
    }

    dealData(props.data)
  }, [props.data])

  useEffect(() => {
    chartRef.current = createChart(document.getElementById('chart') as HTMLElement, chartPropertySetting)

    leftDeptRef.current = chartRef.current.addAreaSeries({
      lineColor: props.createChart.upColor,
      // topColor: props.createChart.upColor,
      topColor: 'rgba(80, 177, 108, 0.35)',
      // bottomColor: props.createChart.upLightColor,
      bottomColor: 'rgba(80, 177, 108, 0.05)',
      lineWidth: 1,
      ...chartPriceLineProperty,
    })

    centerDeptRef.current = chartRef.current.addLineSeries({
      color: '#ff0000',
      lineWidth: 1,
      lineStyle: LineStyle.Solid,
      lineType: 2,
      ...chartPriceLineProperty,
    })

    // --sell_down_color
    rightDeptRef.current = chartRef.current.addAreaSeries({
      lineColor: props.createChart.downColor,
      // topColor: props.createChart.downColor,
      // bottomColor: props.createChart.downLightColor,
      topColor: 'rgba(233, 90, 92, 0.35)',
      bottomColor: 'rgba(233, 90, 92, 0.05)',
      lineWidth: 1,
      ...chartPriceLineProperty,
    })

    // dealData(props.data)

    let toolTipWidth = 100
    let toolTipHeight = 80
    let toolTipMargin = 15

    let toolTip = document.createElement('div')
    floatTooltip.current = toolTip
    toolTip.className = `dept-floating-tooltip`
    toolTip.style.color = colorRef.current.textColor01 as string
    toolTip.style.background = colorRef.current.cardBgColor03 as string

    document.getElementById('chart')?.appendChild(toolTip)

    const subscribeTimeChange = newVisibleTimeRange => {
      if (chartRef.current?.timeScale().getVisibleRange()?.from) {
        setVerLineChart()
      }
    }
    chartRef.current.timeScale().subscribeVisibleTimeRangeChange(subscribeTimeChange)

    // update tooltip
    chartRef.current.subscribeCrosshairMove(function (param: any) {
      if (
        !param.time ||
        param.point.x < 0 ||
        param.point.x > (deptRef?.current?.clientWidth || 0) ||
        param.point.y < 0 ||
        param.point.y > (deptRef?.current?.clientHeight || 0)
      ) {
        toolTip.style.display = 'none'
        return
      }

      let dateStr = param.time
      toolTip.style.display = 'block'
      toolTip.style.color = colorRef.current.textColor01 as string

      let leftCount = param.seriesData?.get(leftDeptRef.current)?.value
      let rightCount = param.seriesData?.get(rightDeptRef.current)?.value
      let chgTemp = 0
      let chg = `${chgTemp.toFixed(priceOffset || 2)}%`
      let dir = dateStr >= rightDataRef.current?.[0]?.value ? TradeDirectionEnum.Sell : TradeDirectionEnum.Buy
      let symbol = dateStr >= rightDataRef.current?.[0]?.value ? '+' : '-'

      const newData = leftDataRef.current?.concat(rightDataRef.current || [])
      newData?.forEach(item => {
        symbol = item.direction === TradeDirectionEnum.Buy ? '-' : '+'
        if (item.time === dateStr) {
          chg = `${symbol}${item.chg.toFixed(priceOffset || 2)}%`
          dir = item.direction
        }
      })

      // eslint-disable-next-line no-useless-concat
      toolTip.innerHTML =
        `<div style="display: flex; justify-content: space-between; min-width: 120px;"><span>价差幅度</span><span style="color: ${
          dir === TradeDirectionEnum.Buy ? colorRef.current.upColor : colorRef.current.downColor
        }">${chg}</span></div>` +
        `<div style="display: flex; justify-content: space-between; min-width: 120px; margin-top: 16px; color: ${colorRef.current.textColor01}"><span>委托价格</span><span>${dateStr}</span></div>` +
        `<div style="display: flex; justify-content: space-between; min-width: 120px; margin-top: 16px; color: ${
          colorRef.current.textColor01
        }"><span>累计挂单</span><span>${leftCount || rightCount}</span></div>`

      let y = param.point.y

      let left = param.point.x + toolTipMargin
      if (left > (deptRef?.current?.clientWidth || 0) - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth
      }

      let top = y + toolTipMargin
      if (top > (deptRef?.current?.clientHeight || 0) - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin
      }

      toolTip.style.left = `${left}px`
      toolTip.style.top = `${top}px`
    })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: deptRef.current?.clientWidth,
        height: deptRef.current?.clientHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (leftDeptRef.current && rightDeptRef.current) {
      if (colors === UserUpsAndDownsColorEnum.greenUpRedDown) {
        leftDeptRef.current.applyOptions({
          lineColor: props.createChart.upColor,
          topColor: 'rgba(80, 177, 108, 0.35)',
          bottomColor: 'rgba(80, 177, 108, 0.05)',
        })
        rightDeptRef.current.applyOptions({
          lineColor: props.createChart.downColor,
          topColor: 'rgba(233, 90, 92, 0.35)',
          bottomColor: 'rgba(233, 90, 92, 0.05)',
        })
      } else {
        leftDeptRef.current.applyOptions({
          lineColor: props.createChart.upColor,
          topColor: 'rgba(233, 90, 92, 0.35)',
          bottomColor: 'rgba(233, 90, 92, 0.05)',
        })
        rightDeptRef.current.applyOptions({
          lineColor: props.createChart.downColor,
          topColor: 'rgba(80, 177, 108, 0.35)',
          bottomColor: 'rgba(80, 177, 108, 0.05)',
        })
      }
    }
  }, [colors])

  return (
    <div ref={deptRef} className="chart" id="chart">
      <div
        className="center-ver-line"
        style={{
          width: '1px',
          height: (deptRef.current?.clientHeight || 0) - 26,
          top: 0,
          left: centerVerLine.x,
          background: props.chartLayoutOptions.textColor,
          opacity: 0.5,
        }}
      ></div>
    </div>
  )
}

DeptRealChart.displayName = 'deptChart'

export default DeptRealChart
