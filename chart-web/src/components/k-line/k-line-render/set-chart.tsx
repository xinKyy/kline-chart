import React from 'react'

import { MainIndicatorType, SubIndicatorType } from '@nbit/chart-utils'
import { ISeriesApi } from '@nbit/lightweight-charts'

import '../index.css'

interface PropsType {
  mainIndicator: MainIndicatorType
  subIndicator: SubIndicatorType
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
  type: string
}

function SetChart(props: PropsType) {
  const {
    mainIndicator,
    subIndicator,
    chartSettingIcon,
    allChartRef,
    // point,
    updateMainIndicator,
    updateSubIndicator,
    modalRef,
    type,
  } = props

  const hideMainChart = value => {
    switch (value) {
      case 'ma':
        allChartRef.smaLineRef?.forEach(item => {
          item.applyOptions({
            visible: mainIndicator.ma.hide,
          })
        })
        updateMainIndicator({
          ...mainIndicator,
          ma: {
            ...mainIndicator.ma,
            hide: !mainIndicator.ma.hide,
          },
        })
        break

      case 'boll':
        allChartRef.bollRef?.mid.applyOptions({
          visible: mainIndicator.boll.hide,
        })
        allChartRef.bollRef?.upper.applyOptions({
          visible: mainIndicator.boll.hide,
        })
        allChartRef.bollRef?.lower.applyOptions({
          visible: mainIndicator.boll.hide,
        })
        updateMainIndicator({
          ...mainIndicator,
          boll: {
            ...mainIndicator.boll,
            hide: !mainIndicator.boll.hide,
          },
        })
        break

      case 'vol':
        allChartRef.volumeSeriesRef?.applyOptions({
          visible: subIndicator.vol?.hide,
        })
        updateSubIndicator({
          ...subIndicator,
          vol: {
            ...subIndicator.vol,
            hide: !subIndicator.vol?.hide,
          },
        })
        break

      case 'macd':
        allChartRef.difRef?.applyOptions({
          visible: subIndicator.macd.hide,
        })
        allChartRef.deaRef?.applyOptions({
          visible: subIndicator.macd.hide,
        })
        allChartRef.macdVolumeSeriesRef?.applyOptions({
          visible: subIndicator.macd.hide,
        })
        updateSubIndicator({
          ...subIndicator,
          macd: {
            ...subIndicator.macd,
            hide: !subIndicator.macd.hide,
          },
        })
        break

      case 'kdj':
        allChartRef.kdjRef?.k.applyOptions({
          visible: subIndicator.kdj.hide,
        })
        allChartRef.kdjRef?.d.applyOptions({
          visible: subIndicator.kdj.hide,
        })
        allChartRef.kdjRef?.j.applyOptions({
          visible: subIndicator.kdj.hide,
        })
        updateSubIndicator({
          ...subIndicator,
          kdj: {
            ...subIndicator.kdj,
            hide: !subIndicator.kdj.hide,
          },
        })
        break

      case 'rsi':
        allChartRef.rsiRef?.forEach(item => {
          item.applyOptions({
            visible: subIndicator.rsi.hide,
          })
        })
        updateSubIndicator({
          ...subIndicator,
          rsi: {
            ...subIndicator.rsi,
            hide: !subIndicator.rsi.hide,
          },
        })
        break

      case 'wr':
        allChartRef.wrRef?.forEach(item => {
          item.applyOptions({
            visible: subIndicator.wr.hide,
          })
        })
        updateSubIndicator({
          ...subIndicator,
          wr: {
            ...subIndicator.wr,
            hide: !subIndicator.wr.hide,
          },
        })
        break

      default:
        allChartRef.smaLineRef?.forEach(item => {
          item.applyOptions({
            visible: !mainIndicator.ma.hide,
          })
        })
        updateMainIndicator({
          ...mainIndicator,
          ma: {
            ...mainIndicator.ma,
            hide: !mainIndicator.ma.hide,
          },
        })
        break
    }
  }

  const openSetChartModal = () => {
    modalRef?.openChartSettingModal()
  }

  const deleteMainChart = value => {
    switch (value) {
      case 'ma':
        updateMainIndicator({
          ...mainIndicator,
          ma: {
            ...mainIndicator.ma,
            select: false,
          },
        })
        break

      case 'boll':
        updateMainIndicator({
          ...mainIndicator,
          boll: {
            ...mainIndicator.boll,
            select: false,
          },
        })
        break

      case 'vol':
        updateSubIndicator({
          ...subIndicator,
          vol: {
            ...subIndicator.vol,
            select: false,
          },
        })
        break

      case 'macd':
        updateSubIndicator({
          ...subIndicator,
          macd: {
            ...subIndicator.macd,
            select: false,
          },
        })
        break

      case 'kdj':
        updateSubIndicator({
          ...subIndicator,
          kdj: {
            ...subIndicator.kdj,
            select: false,
          },
        })
        break

      case 'rsi':
        updateSubIndicator({
          ...subIndicator,
          rsi: {
            ...subIndicator.rsi,
            select: false,
          },
        })
        break

      case 'wr':
        updateSubIndicator({
          ...subIndicator,
          wr: {
            ...subIndicator.wr,
            select: false,
          },
        })
        break

      default:
        allChartRef.smaLineRef?.forEach(item => {
          item.applyOptions({
            visible: !mainIndicator.ma.hide,
          })
        })
        updateMainIndicator({
          ...mainIndicator,
          ma: {
            ...mainIndicator.ma,
            hide: !mainIndicator.ma.hide,
          },
        })
        break
    }
  }

  return (
    <>
      <div key={'hidden'} onClick={() => hideMainChart(type)} className="chart-hidden chart-set-icon-wrap common-ml-5">
        <span className="not-hidden-hover">{chartSettingIcon.hidden}</span>
        <span className="have-hidden-hover">{chartSettingIcon.hiddenHover}</span>
      </div>

      <div key={'setting'} onClick={openSetChartModal} className="chart-set chart-set-icon-wrap common-ml-5">
        <span className="not-set-hover">{chartSettingIcon.setting}</span>
        <span className="have-set-hover">{chartSettingIcon.settingHover}</span>
      </div>

      <div
        key={'delete'}
        onClick={() => deleteMainChart(type)}
        className="chart-delete chart-set-icon-wrap common-ml-5"
      >
        <span className="not-delete-hover">{chartSettingIcon.delete}</span>
        <span className="have-delete-hover">{chartSettingIcon.deleteHover}</span>
      </div>
    </>
  )
}

export default SetChart
