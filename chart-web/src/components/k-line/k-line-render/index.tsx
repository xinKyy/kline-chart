import React, { useRef, useState } from 'react'
import classNames from 'classnames'

import {
  MainIndicatorType,
  SubIndicatorType,
  timeLocaleLanguageMap,
  CommonMainOrSubType,
  bollKList,
  macdKList,
  kdjKList,
  CreateChartType,
  OrdersKlineDataType,
  MarkersType,
  CurMarkersType,
  SwitchTimeType,
} from '@nbit/chart-utils'
import { ISeriesApi } from '@nbit/lightweight-charts'

import OrderPop from '../order-pop'
import OrderModal from '../order-modal'
import '../index.css'
import SetChart from './set-chart'
import { MainKType, SubKType, tradeDirection } from '../helper'

type SN = string | number

interface ScaleMargins {
  top: number
  bottom: number
}

interface ExpandType {
  mainK: boolean
  ma: boolean
  boll: boolean
  vol: boolean
  macd: boolean
  kdj: boolean
  rsi: boolean
  wr: boolean
}

interface BollKType {
  mid: number
  upper: number
  lower: number
}

interface KdjKType {
  k: number
  d: number
  j: number
}

interface RsiKType {
  r: number
  s: number
  i: number
}

interface CurMaxAndMinPointType {
  min: {
    time: number
    value: number
    x: number
    y: number
  }
  max: {
    time: number
    value: number
    x: number
    y: number
  }
}

/** 三元期权交易方向 */
enum TernaryOptionTradeDirectionEnum {
  /** 买涨 */
  call = 'call',
  /** 买跌 */
  put = 'put',
  /** 涨超 */
  overCall = 'over_call',
  /** 跌超 */
  overPut = 'over_put',
}

/** 三元期权交易结果 */
enum TernaryOptionTradeStatus {
  /** 成功 */
  success = 'success',
  /** 失败 */
  fail = 'fail',
  /** 等待 */
  wait = 'wait',
}

interface PropsType {
  mainIndicator: MainIndicatorType
  subIndicator: SubIndicatorType
  createChart: CreateChartType | any
  locale: string
  ordersKlineData: OrdersKlineDataType[]
  expandIcon: React.ReactElement
  expand: ExpandType
  expandClick: (k) => void
  mainK: MainKType
  maIndicator: Array<number>
  bollK: BollKType
  macdScaleMargins: ScaleMargins
  subK: SubKType | undefined
  kdjScaleMargins: ScaleMargins
  kdjK: KdjKType | undefined
  rsiScaleMargins: ScaleMargins
  rsiK: RsiKType | undefined
  wrScaleMargins: ScaleMargins
  volScaleMargins: ScaleMargins
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  curMaxAndMinPoint: CurMaxAndMinPointType
  curBuyAndSellPoint: CurMaxAndMinPointType
  wrK: Array<number> | undefined
  modalVisible: boolean
  setModalVisible: (v) => void
  tableData: Array<MarkersType>
  popVisible: boolean
  curMarkers: CurMarkersType
  showOrderDetail: (v, e) => void
  volume: {
    vol: number
    quoteVolume: number
    dir: string
  }
  coinInfo: {
    baseSymbolName: string
    quoteSymbolName: string
  }
  priceOffset: number
  chartSettingIcon: {
    hidden: React.ReactElement
    setting: React.ReactElement
    delete: React.ReactElement
    hiddenHover: React.ReactElement
    settingHover: React.ReactElement
    deleteHover: React.ReactElement
  }
  allChartRef: {
    candlestickSeriesRef: ISeriesApi<'Candlestick'> | undefined
    timeLineRef: ISeriesApi<'Line'> | undefined
    smaLineRef: Array<ISeriesApi<'Line'>> | undefined
    difRef: ISeriesApi<'Line'> | undefined
    deaRef: ISeriesApi<'Line'> | undefined
    macdVolumeSeriesRef: ISeriesApi<'Histogram'> | undefined
    volumeSeriesRef: ISeriesApi<'Histogram'> | undefined
    bollRef:
      | {
          mid: ISeriesApi<'Line'>
          upper: ISeriesApi<'Line'>
          lower: ISeriesApi<'Line'>
        }
      | undefined
    kdjRef:
      | {
          k: ISeriesApi<'Line'>
          d: ISeriesApi<'Line'>
          j: ISeriesApi<'Line'>
        }
      | undefined
    rsiRef: Array<ISeriesApi<'Line'>> | undefined
    wrRef: Array<ISeriesApi<'Line'>> | undefined
  }
  updateMainIndicator: (v) => void
  updateSubIndicator: (v) => void
  modalRef:
    | {
        openChartSettingModal: () => void
      }
    | undefined
  // point: { x: number; y: number }
  curTime: SwitchTimeType
  optionIcon?: any
  optionBuyCallback?: any
  optionSellCallback?: any
  optionActiveTab?: any
  countDownComponent?: any
  tradeRestSecond?: any
  tradeStatusOverList?: any
  optionAnimation?: any
}

function KLineRender(props: PropsType) {
  const {
    mainIndicator,
    subIndicator,
    ordersKlineData,
    expand,
    expandClick,
    mainK,
    maIndicator,
    bollK,
    macdScaleMargins,
    subK,
    kdjScaleMargins,
    kdjK,
    rsiScaleMargins,
    rsiK,
    wrScaleMargins,
    containerRef,
    curMaxAndMinPoint,
    curBuyAndSellPoint,
    wrK,
    modalVisible,
    setModalVisible,
    tableData,
    popVisible,
    curMarkers,
    showOrderDetail,
    volume,
    volScaleMargins,
    coinInfo,
    createChart,
    priceOffset,
    chartSettingIcon,
    allChartRef,
    // point,
    updateMainIndicator,
    updateSubIndicator,
    modalRef,
    optionBuyCallback,
    optionSellCallback,
    optionIcon,
    optionActiveTab,
    countDownComponent,
    tradeRestSecond,
    curTime,
    tradeStatusOverList,
    optionAnimation,
  } = props

  const maxElementRef = useRef<HTMLDivElement | null>(null)
  const minElementRef = useRef<HTMLDivElement | null>(null)
  const [audioStatus, setAudioStatus] = useState<string>(TernaryOptionTradeStatus.wait)
  const mainKList = [
    {
      name: timeLocaleLanguageMap[props.locale]['开'],
      value: 'open',
    },
    {
      name: timeLocaleLanguageMap[props.locale]['高'],
      value: 'high',
    },
    {
      name: timeLocaleLanguageMap[props.locale]['低'],
      value: 'low',
    },
    {
      name: timeLocaleLanguageMap[props.locale]['收'],
      value: 'close',
    },
    {
      name: timeLocaleLanguageMap[props.locale]['涨跌幅'],
      value: 'chg',
    },
    {
      name: timeLocaleLanguageMap[props.locale]['振幅'],
      value: 'amp',
    },
  ]

  const getHeight = scaleMargins => {
    if (containerRef.current?.clientHeight) {
      return (containerRef.current.clientHeight - 26) * scaleMargins - 18
    }
  }

  // console.log('maIndicator---', maIndicator)
  // console.log('bollKList---', bollKList)
  // console.log('bollK---', bollK)
  // console.log('volume---', volume)

  // console.log('wrK---', wrK)
  // console.log('RsiK---', rsiK)
  // console.log('kdjK', kdjK)
  // console.log('kdjKList', kdjKList)

  // console.log('mainK', mainK)
  // console.log('macdKList', macdKList)
  // console.log('subK', subK)
  // console.log('subIndicator.kdj.curLine', subIndicator.kdj)

  return (
    <div className="rel-chart">
      <div className="k-data">
        <div className="k-line-ind-wrap h-4 text-text_color_03 common-text">
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.mainK ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('mainK')
            }}
          >
            {props.expandIcon}
          </div>
          {expand.mainK
            ? [
                <span key={'time'} className="leading-4">
                  {mainK?.time}
                </span>,
                mainKList.map(item => {
                  return (
                    <span key={item.value} className="common-ml-5 leading-4">
                      {item.name}:
                      <span
                        className={classNames('common-ml-5', {
                          'text-buy_up_color': mainK?.isUp,
                          'text-sell_down_color': !mainK?.isUp,
                        })}
                      >
                        {item.value === 'open' ||
                        item.value === 'high' ||
                        item.value === 'low' ||
                        item.value === 'close'
                          ? Number(mainK?.[item.value])?.toFixed(priceOffset)
                          : mainK?.[item.value]}
                      </span>
                    </span>
                  )
                }),
                mainK?.buy ? (
                  <span className="common-ml-5 leading-4">
                    {timeLocaleLanguageMap[props.locale]['买涨']}:
                    <span
                      className={classNames('common-ml-5', {
                        'text-buy_up_color': mainK?.isUp,
                        'text-sell_down_color': !mainK?.isUp,
                      })}
                    >
                      {mainK?.buy}
                    </span>
                  </span>
                ) : null,
                mainK?.sell ? (
                  <span className="common-ml-5 leading-4">
                    {timeLocaleLanguageMap[props.locale]['买跌']}:
                    <span
                      className={classNames('common-ml-5', {
                        'text-buy_up_color': mainK?.isUp,
                        'text-sell_down_color': !mainK?.isUp,
                      })}
                    >
                      {mainK?.sell}
                    </span>
                  </span>
                ) : null,

                mainK?.overBuy ? (
                  <span className="common-ml-5 leading-4">
                    {timeLocaleLanguageMap[props.locale]['买超涨']}:
                    <span
                      className={classNames('common-ml-5', {
                        'text-buy_up_color': mainK?.isUp,
                        'text-sell_down_color': !mainK?.isUp,
                      })}
                    >
                      {mainK?.overBuy}
                    </span>
                  </span>
                ) : null,

                mainK?.overSell ? (
                  <span className="common-ml-5 leading-4">
                    {timeLocaleLanguageMap[props.locale]['买超跌']}:
                    <span
                      className={classNames('common-ml-5', {
                        'text-buy_up_color': mainK?.isUp,
                        'text-sell_down_color': !mainK?.isUp,
                      })}
                    >
                      {mainK?.overSell}
                    </span>
                  </span>
                ) : null,

                mainK?.priceSpread && curTime.unit === 's' ? (
                  <span className="common-ml-5 leading-4">
                    {timeLocaleLanguageMap[props.locale]['价差']}:
                    <span
                      className={classNames('common-ml-5', {
                        'text-buy_up_color': mainK?.isUp,
                        'text-sell_down_color': !mainK?.isUp,
                      })}
                    >
                      {mainK?.priceSpread}
                    </span>
                  </span>
                ) : null,
              ]
            : null}
        </div>
      </div>
      <div className="ma">
        {mainIndicator.ma.select ? (
          <div className="flex text-text_color_03 k-line-ind-wrap common-text">
            <div
              className="mr-2 expand-icon-wrap"
              style={{
                transform: !expand.ma ? 'rotate(-90deg)' : 'unset',
              }}
              onClick={() => {
                expandClick('ma')
              }}
            >
              {props.expandIcon}
            </div>
            {expand.ma
              ? mainIndicator.ma.cur.map((item, index) => {
                  if (item.select) {
                    return (
                      <span key={item.strip} className="ma-child">
                        {`MA(${item.strip}):`}
                        <span className="common-ml-5" style={{ color: item.color }}>
                          {maIndicator?.[index]?.toFixed(priceOffset)}
                        </span>
                      </span>
                    )
                  }
                  return null
                })
              : null}
            <SetChart
              mainIndicator={mainIndicator}
              subIndicator={subIndicator}
              chartSettingIcon={chartSettingIcon}
              allChartRef={allChartRef}
              updateMainIndicator={updateMainIndicator}
              updateSubIndicator={updateSubIndicator}
              modalRef={modalRef}
              type={'ma'}
            />
          </div>
        ) : null}
        {mainIndicator.boll.select ? (
          <div className="text-text_color_03 k-line-ind-wrap flex">
            <div
              className="mr-2 expand-icon-wrap"
              style={{
                transform: !expand.boll ? 'rotate(-90deg)' : 'unset',
              }}
              onClick={() => {
                expandClick('boll')
              }}
            >
              {props.expandIcon}
            </div>
            {expand.boll ? (
              <span className="ma-child">
                {`BOLL(${(mainIndicator.boll.cur.mid as CommonMainOrSubType).value}, ${
                  (mainIndicator.boll.cur.std as CommonMainOrSubType).value
                }):`}
                {mainIndicator.boll.curLine?.map((item, index) => {
                  if (item.select) {
                    return [
                      <span key={`${item.color}1`} className="common-ml-5">
                        {bollKList[index].name}
                      </span>,
                      <span key={`${item.color}2`} className="common-ml-5" style={{ color: item.color }}>
                        {bollK[bollKList[index]?.value]}
                      </span>,
                    ]
                  }
                  return null
                })}
              </span>
            ) : null}
            <SetChart
              mainIndicator={mainIndicator}
              subIndicator={subIndicator}
              chartSettingIcon={chartSettingIcon}
              allChartRef={allChartRef}
              updateMainIndicator={updateMainIndicator}
              updateSubIndicator={updateSubIndicator}
              modalRef={modalRef}
              type={'boll'}
            />
            {/* <div onClick={() => hideMainChart('ma')} className="chart-set-icon-wrap common-ml-5">
              {chartSettingIcon.hidden}
            </div>
            <div onClick={openSetChartModal} className="chart-set-icon-wrap common-ml-5">
              {chartSettingIcon.setting}
            </div>
            <div onClick={() => deleteMainChart('ma')} className="chart-set-icon-wrap common-ml-5">
              {chartSettingIcon.delete}
            </div> */}
          </div>
        ) : null}
      </div>

      {subIndicator.vol?.select ? (
        <div
          className="common-sub-ind text-text_color_03"
          style={{
            // top: `${(macdScaleMargins.top - 0.05) * 100}%`,
            /** chart 下移了0.5，这里递减 */
            // top: `calc(${(volScaleMargins.top - 0.1) * 100}% - 10px)`,
            top: getHeight(volScaleMargins.top),
          }}
        >
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.vol ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('vol')
            }}
          >
            {props.expandIcon}
          </div>
          {expand.vol
            ? [
                <span key={1}>
                  <span>Vol({coinInfo.baseSymbolName})</span>
                  <span
                    className="common-ml-5"
                    style={{ color: volume.dir === 'rise' ? createChart.upColor : createChart.downColor }}
                  >
                    {volume.vol}
                  </span>
                </span>,
                <span key={2} className="common-ml-5">
                  <span>Vol({coinInfo.quoteSymbolName})</span>
                  <span
                    style={{ color: volume.dir === 'rise' ? createChart.upColor : createChart.downColor }}
                    className="common-ml-5"
                  >
                    {volume.quoteVolume}
                  </span>
                </span>,
              ]
            : null}
          <SetChart
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            chartSettingIcon={chartSettingIcon}
            allChartRef={allChartRef}
            updateMainIndicator={updateMainIndicator}
            updateSubIndicator={updateSubIndicator}
            modalRef={modalRef}
            type={'vol'}
          />
        </div>
      ) : null}
      {subIndicator.macd.select ? (
        <div
          className="common-sub-ind text-text_color_03"
          style={{
            /** 减去自身高度和时间高度 */
            // top: `calc(${macdScaleMargins.top * 100}% - 36px)`,
            top: getHeight(macdScaleMargins.top),
          }}
        >
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.macd ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('macd')
            }}
          >
            {props.expandIcon}
          </div>
          {expand.macd
            ? [
                <span key={'macd'}>{`MACD(${(subIndicator.macd.cur.fast as CommonMainOrSubType).value}, ${
                  (subIndicator.macd.cur.slow as CommonMainOrSubType).value
                }, ${(subIndicator.macd.cur.signal as CommonMainOrSubType).value})`}</span>,
                subIndicator.macd.curLine?.map((item, index) => {
                  return (
                    <span key={item.color} className="common-ml-5" style={{ color: item.color }}>
                      {Number(subK?.[macdKList[index]?.value]).toFixed(priceOffset)}
                    </span>
                  )
                }),
              ]
            : null}
          <SetChart
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            chartSettingIcon={chartSettingIcon}
            allChartRef={allChartRef}
            updateMainIndicator={updateMainIndicator}
            updateSubIndicator={updateSubIndicator}
            modalRef={modalRef}
            type={'macd'}
          />
        </div>
      ) : null}
      {subIndicator.kdj.select ? (
        <div
          style={{
            // top: `calc(${kdjScaleMargins.top * 100}% - 36px)`,
            top: getHeight(kdjScaleMargins.top),
          }}
          className="common-sub-ind text-text_color_03"
        >
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.kdj ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('kdj')
            }}
          >
            {props.expandIcon}
          </div>

          {expand.kdj ? (
            <span className="ma-child">
              {`KDJ(${(subIndicator.kdj.cur.k as CommonMainOrSubType).value}, ${
                (subIndicator.kdj.cur.d as CommonMainOrSubType).value
              }, ${(subIndicator.kdj.cur.j as CommonMainOrSubType).value}):`}
              {subIndicator.kdj.curLine?.map((item, index) => {
                return [
                  <span key={`${item.color}1`} className="common-ml-5">
                    {kdjKList[index].name}
                  </span>,
                  <span key={`${item.color}2`} className="common-ml-5" style={{ color: item.color }}>
                    {kdjK?.[kdjKList[index]?.value]}
                  </span>,
                ]
              })}
            </span>
          ) : null}
          <SetChart
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            chartSettingIcon={chartSettingIcon}
            allChartRef={allChartRef}
            updateMainIndicator={updateMainIndicator}
            updateSubIndicator={updateSubIndicator}
            modalRef={modalRef}
            type={'kdj'}
          />
        </div>
      ) : null}
      {subIndicator.rsi.select ? (
        <div
          style={{
            // top: `calc(${rsiScaleMargins.top * 100}% - 36px)`,
            top: getHeight(rsiScaleMargins.top),
          }}
          className="common-sub-ind text-text_color_03"
        >
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.rsi ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('rsi')
            }}
          >
            {props.expandIcon}
          </div>
          {expand.rsi
            ? subIndicator.rsi.cur.map((item, index) => {
                if (item.select) {
                  return (
                    <span key={index} className="ma-child">
                      {`RSI(${item.value})`}
                      <span className="common-ml-5" style={{ color: item.color }}>
                        {rsiK?.[Object.keys(rsiK)[index]]}
                      </span>
                    </span>
                  )
                }
                return null
              })
            : null}
          <SetChart
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            chartSettingIcon={chartSettingIcon}
            allChartRef={allChartRef}
            updateMainIndicator={updateMainIndicator}
            updateSubIndicator={updateSubIndicator}
            modalRef={modalRef}
            type={'rsi'}
          />
        </div>
      ) : null}
      {subIndicator.wr.select ? (
        <div
          style={{
            // top: `calc(${wrScaleMargins.top * 100}% - 36px)`,
            top: getHeight(wrScaleMargins.top),
          }}
          className="common-sub-ind text-text_color_03"
        >
          <div
            className="mr-2 expand-icon-wrap"
            style={{
              transform: !expand.wr ? 'rotate(-90deg)' : 'unset',
            }}
            onClick={() => {
              expandClick('wr')
            }}
          >
            {props.expandIcon}
          </div>
          {expand.wr
            ? subIndicator.wr.cur.map((item, index) => {
                if (item.select) {
                  return (
                    <span key={index} className="ma-child">
                      {`Wm %R(${item.value})`}
                      <span className="common-ml-5" style={{ color: item.color }}>
                        {wrK?.[index]}
                      </span>
                    </span>
                  )
                }
                return null
              })
            : null}
          <SetChart
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            chartSettingIcon={chartSettingIcon}
            allChartRef={allChartRef}
            updateMainIndicator={updateMainIndicator}
            updateSubIndicator={updateSubIndicator}
            modalRef={modalRef}
            type={'wr'}
          />
        </div>
      ) : null}
      <div className="chart" id="chart" ref={containerRef}>
        {tradeStatusOverList?.length ? (
          tradeStatusOverList[0].loading ? (
            <div
              className="chart-max-or-min-price"
              style={{
                top:
                  tradeStatusOverList[0].sideInd === tradeDirection.call ||
                  tradeStatusOverList[0].sideInd === tradeDirection.overCall
                    ? tradeStatusOverList[0].y - 35
                    : tradeStatusOverList[0].y,
                left: tradeStatusOverList[0].x - 17 || 0,
                color: createChart.textColor01,
              }}
            >
              <div style={{ width: '34px', height: '34px', background: createChart.bgColor }}>
                {optionAnimation.loading}
              </div>
            </div>
          ) : (
            <div
              className="chart-max-or-min-price"
              style={{
                top:
                  tradeStatusOverList[0].sideInd === tradeDirection.call ||
                  tradeStatusOverList[0].sideInd === tradeDirection.overCall
                    ? tradeStatusOverList[0].y - 35
                    : tradeStatusOverList[0].y,
                left: tradeStatusOverList[0].x - 17 || 0,
                color: createChart.textColor01,
              }}
            >
              {tradeStatusOverList[0].realizedProfit > 0 ? (
                <audio
                  src="https://bitcastle-frontend-static.s3.ap-southeast-1.amazonaws.com/audio/win.mp3"
                  autoPlay
                  onEnded={() => {
                    setAudioStatus(TernaryOptionTradeStatus.wait)
                  }}
                ></audio>
              ) : (
                <audio
                  src="https://bitcastle-frontend-static.s3.ap-southeast-1.amazonaws.com/audio/lose.mp3"
                  autoPlay
                  onEnded={() => {
                    setAudioStatus(TernaryOptionTradeStatus.wait)
                  }}
                ></audio>
              )}

              {tradeStatusOverList[0].realizedProfit > 0 ? null : (
                <div style={{ width: '34px', height: '34px', background: createChart.bgColor }}>
                  {optionAnimation[tradeStatusOverList[0].sideInd]}
                </div>
              )}
            </div>
          )
        ) : null}
        {!tradeStatusOverList[0]?.loading && tradeStatusOverList[0]?.realizedProfit > 0 ? (
          <div
            className="chart-max-or-min-price"
            style={{
              top: (containerRef.current?.clientHeight || tradeStatusOverList[0].y) / 2 - 200,
              left: (containerRef.current?.clientWidth || tradeStatusOverList[0].x) / 2 - 400,
              color: createChart.textColor01,
              width: '800px',
              height: '400px',
            }}
          >
            {optionAnimation.win}
          </div>
        ) : null}

        {curTime.unit === 's' && curBuyAndSellPoint.max.time ? (
          <div
            className="chart-max-or-min-price"
            style={{
              top: curBuyAndSellPoint.max.y - 34 - 12 || 0,
              left: curBuyAndSellPoint.max.x || 0,
              color: createChart.textColor01,
            }}
          >
            {tradeRestSecond ? (
              countDownComponent(TernaryOptionTradeDirectionEnum.call)
            ) : (
              <div
                onClick={() => {
                  optionBuyCallback()
                }}
              >
                {optionActiveTab === 1 ? optionIcon.up : optionIcon.overUp}
              </div>
            )}
          </div>
        ) : null}

        {curTime.unit === 's' && curBuyAndSellPoint.max.time ? (
          <div
            className="chart-max-or-min-price"
            style={{
              top: curBuyAndSellPoint.max.y + 12 || 0,
              left: curBuyAndSellPoint.max.x || 0,
              color: createChart.textColor01,
            }}
          >
            {tradeRestSecond ? (
              countDownComponent(TernaryOptionTradeDirectionEnum.put)
            ) : (
              <div
                onClick={() => {
                  optionSellCallback()
                }}
              >
                {optionActiveTab === 1 ? optionIcon.down : optionIcon.overDown}
              </div>
            )}
          </div>
        ) : null}

        {/* {curMaxAndMinPoint.max.value !== curMaxAndMinPoint.min.value ? (
          // <div
          //   className="chart-max-or-min-price"
          //   ref={maxElementRef}
          //   style={{
          //     top: curMaxAndMinPoint.max.y - 8.5 || 0,
          //     left:
          //       curMaxAndMinPoint.max.x < (maxElementRef.current?.clientWidth || 0)
          //         ? curMaxAndMinPoint.max.x - 6
          //         : curMaxAndMinPoint.max.x + 6 - (maxElementRef.current?.clientWidth || 0) || 0,
          //     transform: 'scale(0.83)',
          //     color: createChart.textColor01,
          //   }}
          // >
          //   {curMaxAndMinPoint.max.x < (maxElementRef.current?.clientWidth || 0)
          //     ? [
          //         <div key={2} className="bg-text_color_01" style={{ width: '16px', height: '1px' }}></div>,
          //         <span className="ml-1" key={1}>
          //           {curMaxAndMinPoint.max.value}
          //         </span>,
          //       ]
          //     : [
          //         <span key={1}>{curMaxAndMinPoint.max.value}</span>,
          //         <div key={2} className="bg-text_color_01 ml-1" style={{ width: '16px', height: '1px' }}></div>,
          //       ]}
          // </div>
          <div
            className="chart-max-or-min-price"
            style={{
              top: curMaxAndMinPoint.max.y - 20 || 0,
              left: curMaxAndMinPoint.max.x || 0,
              transform: curMaxAndMinPoint.max.x < 80 ? 'scale(0.83)' : 'translateX(-90%) scale(0.83)',
              color: createChart.textColor01,
            }}
          >
            {curMaxAndMinPoint.max.x < 80
              ? [
                  <div key={2} className="bg-text_color_01" style={{ width: '16px', height: '1px' }}></div>,
                  <span className="ml-1" key={1}>
                    {curMaxAndMinPoint.max.value}
                  </span>,
                ]
              : [
                  <span key={1}>{curMaxAndMinPoint.max.value}</span>,
                  <div key={2} className="bg-text_color_01 ml-1" style={{ width: '16px', height: '1px' }}></div>,
                ]}
          </div>
        ) : null} */}
        {/* <div
          className="chart-max-or-min-price"
          ref={minElementRef}
          style={{
            top: curMaxAndMinPoint.min.y - 8.5 || 0,
            left:
              curMaxAndMinPoint.min.x < (minElementRef.current?.clientWidth || 0)
                ? curMaxAndMinPoint.min.x - 6
                : curMaxAndMinPoint.min.x + 6 - (minElementRef.current?.clientWidth || 0) || 0,
            transform: 'scale(0.83)',
            color: createChart.textColor01,
          }}
        >
          {curMaxAndMinPoint.min.x < 80
            ? [
                <div key={2} className="bg-text_color_01" style={{ width: '16px', height: '1px' }}></div>,
                <span className="ml-1" key={1}>
                  {curMaxAndMinPoint.min.value}
                </span>,
              ]
            : [
                <span key={1}>{curMaxAndMinPoint.min.value}</span>,
                <div key={2} className="bg-text_color_01 ml-1" style={{ width: '16px', height: '1px' }}></div>,
              ]}
        </div> */}
        {/* <div
          className="chart-max-or-min-price"
          style={{
            top: curMaxAndMinPoint.min.y || 0,
            left: curMaxAndMinPoint.min.x || 0,
            transform: curMaxAndMinPoint.min.x < 80 ? 'scale(0.83)' : 'translateX(-90%) scale(0.83)',
            color: createChart.textColor01,
          }}
        >
          {curMaxAndMinPoint.min.x < 80
            ? [
                <div key={2} className="bg-text_color_01" style={{ width: '16px', height: '1px' }}></div>,
                <span className="ml-1" key={1}>
                  {curMaxAndMinPoint.min.value}
                </span>,
              ]
            : [
                <span key={1}>{curMaxAndMinPoint.min.value}</span>,
                <div key={2} className="bg-text_color_01 ml-1" style={{ width: '16px', height: '1px' }}></div>,
              ]}
        </div> */}
        {/* {point.x && point.y ? (
          <div style={{ top: point.y, left: point.x, position: 'absolute' }}>
            <div className="cross-hair-point"></div>
          </div>
        ) : null} */}
      </div>
      <OrderModal
        locale={props.locale}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        tableData={tableData}
      />
      {popVisible ? (
        <OrderPop
          ordersKlineData={ordersKlineData as unknown as OrdersKlineDataType[]}
          curMarkers={curMarkers as CurMarkersType}
          showOrderDetail={showOrderDetail}
          createChart={createChart}
          locale={props.locale}
        />
      ) : null}
    </div>
  )
}

export default KLineRender
