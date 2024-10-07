import React, { useEffect, useState, memo } from 'react'
import './index.css'
import { getTheme, DeptChartData, DeptChartSpecieEnum } from '@nbit/chart-utils'
import DeptChart from './dept-chart'
import DeptRealChart from './dept-real-chart'

interface PropsType {
  theme: string
  deptData: Array<DeptChartData>
  type?: DeptChartSpecieEnum
  offset: {
    priceOffset: number
    amountOffset: number
  }
  colors: number
  xCoordinateData?: Array<number>
}

function Dept(props: PropsType) {
  const {
    bgColor,
    textColor,
    textColor01,
    cardBgColor03,
    brandColor,
    upColor,
    downColor,
    upLightColor,
    downLightColor,
    cardBgColor,
  } = getTheme()
  const [chartLayoutOptions, setChartLayoutOptions] = useState({
    background: {
      color: bgColor,
    },
    textColor,
  })

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

  const { priceOffset } = props.offset
  const { colors, xCoordinateData } = props
  return (
    <div className="dept-chart-wrap">
      <div className="dept-chart">
        {props.type === DeptChartSpecieEnum.Dept ? (
          <DeptChart
            chartLayoutOptions={chartLayoutOptions}
            data={props.deptData}
            createChart={{ brandColor, upColor, downColor, upLightColor, downLightColor }}
          />
        ) : (
          <DeptRealChart
            chartLayoutOptions={chartLayoutOptions}
            data={props.deptData}
            theme={props.theme}
            priceOffset={priceOffset}
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
            colors={colors}
          />
        )}
      </div>
    </div>
  )
}

export default memo(Dept)
