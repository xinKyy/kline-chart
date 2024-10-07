import dayjs from 'dayjs'
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineData,
  LineStyle,
  PriceScaleMode,
} from '@nbit/lightweight-charts'
import React, { useEffect, useRef } from 'react'
import { SeriesChartData, ThemeEnum } from '@nbit/chart-utils'

export interface PropsType {
  data: Array<SeriesChartData>
  chartLayoutOptions: any
  createChart: {
    brandColor: string
    upColor: string
    downColor: string
    upLightColor: string
    downLightColor: string
    bgColor?: string
    textColor?: string
    cardBgColor?: string
    textColor01?: string
    cardBgColor03?: string
  }
  theme: string
  priceOffset: number
  colors: number
}

function SeriesChart(props: PropsType) {
  const lineRef = useRef<any>(null)
  const chartRef = useRef<ISeriesApi<'Line'> | null>(null)
  const chartLineRef = useRef<IChartApi>()
  const { priceOffset, colors } = props

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setData(props.data as LineData[])
    }
  }, [props.data])

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

  const gridColor = props.theme === ThemeEnum.light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'

  const chartPropertySetting = {
    layout: props.chartLayoutOptions,
    localization: {
      timeFormatter: item => {
        return dayjs(item).format('YYYY/MM/DD HH:mm')
      },
      priceFormatter: item => {
        return `${item.toFixed(3)}%`
      },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    // 时间刻度和价格刻度
    timeScale: {
      barSpacing: 40,
      tickMarkFormatter: time => {
        return dayjs(time).format('MM-DD')
      },
      borderColor: gridColor,
      lockVisibleTimeRangeOnResize: true,
    },
    rightPriceScale: {
      borderColor: gridColor,
      // visible: true,
      // alignLabels: true,
      autoScale: true,
    },
    grid: {
      vertLines: {
        color: gridColor,
      },
      horzLines: {
        color: gridColor,
      },
    },
  }

  useEffect(() => {
    chartLineRef.current?.applyOptions({
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
      },
    })
  }, [props.chartLayoutOptions.background, props.chartLayoutOptions.textColor])

  const floatTooltip = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (floatTooltip.current) {
      floatTooltip.current.style.background = props.createChart.cardBgColor as string
      floatTooltip.current.style.color = props.createChart.textColor01 as string
    }
  }, [props.createChart.cardBgColor, props.createChart.textColor])

  useEffect(() => {
    chartLineRef.current = createChart(document.getElementById('chart') as HTMLElement, chartPropertySetting)

    // #f1ae3d
    chartRef.current = chartLineRef.current.addLineSeries({
      color: props?.createChart?.brandColor,
      lineWidth: 1,
      lineStyle: LineStyle.Solid,
      lineType: 2,
      ...chartPriceLineProperty,
    })

    chartRef.current.setData(props.data as LineData[])

    chartLineRef.current.timeScale().fitContent()

    let toolTipWidth = 100
    let toolTipHeight = 40
    let toolTipMargin = 15

    let toolTip = document.createElement('div')
    floatTooltip.current = toolTip
    toolTip.className = 'series-floating-tooltip'
    toolTip.style.color = colorRef.current.textColor01 as string
    toolTip.style.background = colorRef.current.cardBgColor03 as string
    document.getElementById('chart')?.appendChild(toolTip)

    // update tooltip
    chartLineRef.current.subscribeCrosshairMove(function (param: any) {
      if (
        !param.time ||
        param.point.x < 0 ||
        param.point.x > lineRef.current.clientWidth ||
        param.point.y < 0 ||
        param.point.y > lineRef.current.clientHeight
      ) {
        toolTip.style.display = 'none'
        return
      }

      let dateStr = dayjs(param.time).format('MM-DD HH:MM')
      toolTip.style.display = 'block'
      let price = param.seriesData?.get(chartRef.current)?.value
      // eslint-disable-next-line no-useless-concat
      toolTip.innerHTML = `<div>${dateStr}</div>` + `${'<div style="marginTop: 4px">'}${price}%</div>`

      let y = param.point.y

      let left = param.point.x + toolTipMargin
      if (left > lineRef.current.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth
      }

      let top = 20

      toolTip.style.left = `${left}px`
      toolTip.style.top = `${top}px`
    })
  }, [])

  return <div ref={lineRef} className="chart" id="chart"></div>
}

SeriesChart.displayName = 'Series'
export default SeriesChart
