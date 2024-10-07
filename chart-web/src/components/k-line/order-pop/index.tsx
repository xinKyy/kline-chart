import { timeLocaleLanguageMap, CreateChartType, CurMarkersType, OrdersKlineDataType } from '@nbit/chart-utils'
import React, { useRef } from 'react'

interface OrderPopType {
  curMarkers: CurMarkersType
  ordersKlineData: OrdersKlineDataType[]
  showOrderDetail: (type, e) => void
  createChart: CreateChartType
  locale: string
}

/** 订单 pop */
function OrderModal(props: OrderPopType) {
  const { curMarkers, ordersKlineData, showOrderDetail, createChart, locale } = props
  const orderPopRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={orderPopRef}
      style={{
        position: 'absolute',
        top: curMarkers?.y,
        left: curMarkers?.x,
        zIndex: 4,
        background: createChart.bgColor,
        padding: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        transform: 'translate(-50%, -200%)',
      }}
    >
      {curMarkers?.buyData?.length ? (
        <div className="text-xs" style={{ color: createChart.textColor, whiteSpace: 'nowrap' }}>
          <span>
            {`${timeLocaleLanguageMap[locale][`成交`]} ${curMarkers?.buyData?.length} ${
              timeLocaleLanguageMap[locale][`笔`]
            }`}
          </span>
          <span className="ml-2">{`${timeLocaleLanguageMap[locale][`均价`]} ${curMarkers?.buyDetail.avg}`}</span>
          <span
            style={{
              color: createChart.upColor,
            }}
            className="ml-2"
          >
            {timeLocaleLanguageMap[locale][`买入`]}
          </span>
          <span className="ml-2">
            {curMarkers?.buyDetail.count}
            <span className="ml-1">{ordersKlineData?.[0]?.sellCoinShortName}</span>
          </span>
          <span
            style={{
              color: createChart.brandColor,
            }}
            className="ml-2 cursor-pointer"
            onClick={e => {
              showOrderDetail('buy', e)
            }}
          >
            {`${timeLocaleLanguageMap[locale][`查看明细`]} >`}
          </span>
        </div>
      ) : null}
      {curMarkers?.sellData?.length ? (
        <div className="text-xs mt-2" style={{ color: createChart.textColor, whiteSpace: 'nowrap' }}>
          <span>
            {`${timeLocaleLanguageMap[locale][`成交`]} ${curMarkers?.sellData?.length} ${
              timeLocaleLanguageMap[locale][`笔`]
            }`}
          </span>
          <span className="ml-2">{`${timeLocaleLanguageMap[locale][`均价`]} ${curMarkers?.sellDetail.avg}`}</span>
          <span
            style={{
              color: createChart.downColor,
            }}
            className="ml-2"
          >
            {timeLocaleLanguageMap[locale][`卖出`]}
          </span>
          <span className="ml-2">
            {curMarkers?.sellDetail.count}
            <span className="ml-1">{ordersKlineData?.[0]?.sellCoinShortName}</span>
          </span>
          <span
            style={{
              color: createChart.brandColor,
            }}
            className="ml-2 cursor-pointer"
            onClick={e => {
              showOrderDetail('sell', e)
            }}
          >
            {`${timeLocaleLanguageMap[locale][`查看明细`]} >`}
          </span>
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          background: createChart.bgColor,
          left: 'calc(50% - 4px)',
          bottom: '-4px',
          transform: 'rotate(45deg)',
        }}
      ></div>
    </div>
  )
}

export default OrderModal
