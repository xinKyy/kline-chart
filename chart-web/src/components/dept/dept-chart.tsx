import React, { useEffect, useRef } from 'react'
import { createChart } from '@nbit/lightweight-charts'
import { DeptChartPropsType } from '@nbit/chart-utils'

function DeptChart(props: DeptChartPropsType) {
  const deptRef = useRef<any>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const chart = createChart(document.getElementById('chart') as HTMLElement, {
      layout: props.chartLayoutOptions,
      // 时间刻度和价格刻度
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      // 布局相关
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: false,
          labelVisible: false,
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    })

    const front = props.data[props.data.length - 1]?.value || 0
    const end = props.data[props.data.length - 2]?.value || 0
    const isUp = front - end > 0
    chartRef.current = chart.addAreaSeries({
      lineColor: isUp ? props.createChart.upColor : props.createChart.downColor,
      topColor: isUp ? props.createChart.upColor : props.createChart.downColor,
      bottomColor: isUp ? props.createChart.upLightColor : props.createChart.downLightColor,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
    })

    chartRef.current.setData(props.data)
    chart.timeScale().fitContent()
  }, [])

  return <div ref={deptRef} className="chart" id="chart"></div>
}

DeptChart.displayName = 'deptChart'

export default DeptChart
