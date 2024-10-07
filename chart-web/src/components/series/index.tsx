import React, { useEffect, useState, memo } from 'react'
import './index.css'
import { DeptChartSpecieEnum, getTheme, SeriesChartData } from '@nbit/chart-utils'
import SeriesChart from './series-chart'

export interface PropsType {
  theme: string
  seriesData: Array<SeriesChartData>
  type?: DeptChartSpecieEnum
  offset: {
    priceOffset: number
    amountOffset: number
  }
  colors: number
}

function Series(props: PropsType) {
  const {
    bgColor,
    textColor,
    textColor01,
    brandColor,
    upColor,
    downColor,
    upLightColor,
    downLightColor,
    cardBgColor,
    cardBgColor03,
  } = getTheme()

  const [chartLayoutOptions, setChartLayoutOptions] = useState({
    background: {
      color: bgColor,
    },
    textColor,
  })

  const { priceOffset } = props.offset

  useEffect(() => {
    const _bgColor = getTheme().bgColor
    const _textColor = getTheme().textColor
    setChartLayoutOptions({
      background: {
        color: _bgColor,
      },
      textColor: _textColor,
    })
  }, [props.theme])

  return (
    <div className="series-chart-wrap">
      <div className="chart-wrap">
        <SeriesChart
          chartLayoutOptions={chartLayoutOptions}
          data={props.seriesData}
          theme={props.theme}
          priceOffset={priceOffset}
          colors={props.colors}
          createChart={{
            brandColor,
            upColor,
            downColor,
            upLightColor,
            downLightColor,
            bgColor,
            textColor,
            cardBgColor,
            textColor01,
            cardBgColor03,
          }}
        />
      </div>
    </div>
  )
}

export default memo(Series)
