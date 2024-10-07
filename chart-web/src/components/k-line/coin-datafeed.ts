// import { baseMarketStore } from '@/store/market'
// import { getKlineHistory } from '@/apis/market'

import { KLineChartData, sortMarketChartData } from '@nbit/chart-utils'

type DatafeedsType = {
  UDFCompatibleDatafeed: (httpURL, symbol) => void
}

let baseMarketStore
let getKlineHistory
const datafeedsFun = function (store, method) {
  baseMarketStore = store
  getKlineHistory = method
  // 用于临时存储回调函数
  // this._dataCallBacks = {}
  // // 存储当前的时间间隔，1m,5m
  // this._currentSymbol = symbol
  // this._currentName = symbol
  // this._current_resolution = '1min'
}

const Datafeeds: DatafeedsType = {
  UDFCompatibleDatafeed: datafeedsFun,
}

Datafeeds.UDFCompatibleDatafeed = datafeedsFun

function getDecimal() {
  let decimal = 2
  let currentObject = baseMarketStore.getState().currentCoin
  if (currentObject && currentObject.digit && currentObject.digit.indexOf('#') !== -1) {
    let digit = currentObject.digit.split('#')
    decimal = Number(digit[0])
  }

  let str = '1'
  if (decimal > 0) {
    for (let i = 1; i <= decimal; i += 1) {
      str += '0'
    }
  }
  return parseInt(str)
}

/**
 * 构造默认配置
 * {"supports_search":true,"supports_group_request":false,"supports_marks":true,"supports_timescale_marks":true,"supports_time":true,"exchanges":[{"value":"","name":"All Exchanges","desc":""},{"value":"NasdaqNM","name":"NasdaqNM","desc":"NasdaqNM"},{"value":"NYSE","name":"NYSE","desc":"NYSE"},{"value":"NCM","name":"NCM","desc":"NCM"},{"value":"NGM","name":"NGM","desc":"NGM"}],"symbols_types":[{"name":"All types","value":""},{"name":"Stock","value":"stock"},{"name":"Index","value":"index"}],"supported_resolutions":["D","2D","3D","W","3W","M","6M"]}
 */
function defaultConfig() {
  return {
    supports_search: false,
    supports_group_request: false,
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    exchanges: [
      {
        value: '',
        name: 'All Exchanges',
        desc: '',
      },
      {
        value: 'NasdaqNM',
        name: 'NasdaqNM',
        desc: 'NasdaqNM',
      },
      {
        value: 'NYSE',
        name: 'NYSE',
        desc: 'NYSE',
      },
      {
        value: 'NCM',
        name: 'NCM',
        desc: 'NCM',
      },
      {
        value: 'NGM',
        name: 'NGM',
        desc: 'NGM',
      },
    ],
    symbols_types: [
      {
        name: 'All types',
        value: '',
      },
      {
        name: 'Stock',
        value: '',
      },
      {
        name: 'Index',
        value: '',
      },
    ],
    // "supported_resolutions": ['1', '5', '15', '30', '60', 'D', 'W', 'M']
    supported_resolutions: [
      '1',
      '3',
      '5',
      '15',
      '30',
      '60',
      '120',
      '240',
      '360',
      '480',
      '720',
      '1440',
      '4320',
      '10080',
      '43200',
      '129600',
      '259200',
      '518400',
    ],
  }
}

/**
 * onready 方法
 * @param callback
 */
Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  setTimeout(function () {
    callback(defaultConfig())
  }, 0)
}

/**
 *
 * 当需要根据交易对的名字获得交易对的详细信息的时候调用
 * @param symbolName
 * @param onSymbolResolvedCallback
 *
 * @param onResolveErrorCallback
 */
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback
) {
  setTimeout(function () {
    onSymbolResolvedCallback({
      'name': symbolName,
      'exchange-traded': '',
      'exchange-listed': '',
      'timezone': 'Asia/Shanghai',
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': 1,
      'session': '24x7',
      'has_intraday': true,
      'has_no_volume': true,
      'type': 'bitcoin',
      'supported_resolutions': [
        '1',
        '3',
        '5',
        '15',
        '30',
        '60',
        '120',
        '240',
        '360',
        '480',
        '720',
        '1440',
        '4320',
        '10080',
        '43200',
        '129600',
        '259200',
        '518400',
      ],
      'has_weekly_and_monthly': true,
      'has_daily': true,
      'pricescale': getDecimal(),
      'ticker': symbolName,
      'exchange': '',
      'data_status': 'streaming',
    })
  }, 0)
}

/**
 *
 * @param symbolInfo
 * @param resolution
 * @param from
 * @param to
 * @param onHistoryCallback
 * @param onErrorCallback
 * @param firstDataRequest 是否是第一次加载数据，第一次加载数据的时候，可以忽略 to
 *
 * {time, close, open, high, low, volume}
 *
 */
Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) {
  /** k 线柱子数 */
  /** 当滚动到没有数据的时候，会重新去调接口拉数据，相当于只会保存一定的数据在数组中，不会生成一个很大的数组 */
  const { countBack, firstDataRequest, to } = periodParams

  if (to < 0) {
    return onHistoryCallback([], { noData: true })
  }

  let symbol = 'BTCUSDT'
  if (baseMarketStore.getState().currentCoin.tradeId) {
    symbol = baseMarketStore.getState().currentCoin.symbolName
  }

  // 获取历史数据的当前查看数据时间段
  let time = '1m'

  switch (resolution) {
    case '1':
    case '3':
    case '5':
    case '15':
    case '30':
      time = `${resolution}m`
      break
    case '60':
      time = `${1}h`
      break
    case '120':
      time = `${2}h`
      break
    case '240':
      time = `${4}h`
      break
    case '360':
      time = `${6}h`
      break
    case '480':
      time = `${8}h`
      break
    case '720':
      time = `${12}h`
      break
    case '1440':
      time = `${1}d`
      break
    case '4320':
      time = `${3}d`
      break
    case '10080':
      time = `${1}w`
      break
    case '43200':
      time = `${1}M`
      break
    case '129600':
      time = `${3}M`
      break
    case '259200':
      time = `${6}M`
      break
    case '518400':
      time = `${1}y`
      break
    default:
      time = `${resolution}m`
  }

  let params = {
    symbol,
    interval: time,
    limit: String(24 * 60),
    endTime: firstDataRequest ? undefined : to * 1000,
  }

  getKlineHistory(params)
    .then(res => {
      // console.log('tradingview kline res', res)

      if (res.isOk) {
        const klineData: Array<KLineChartData> = []
        if (res.data?.list?.length) {
          res.data.list.forEach(item => {
            const barValue = {
              time: Number(item[6]),
              open: Number(item[0]),
              /** 后端返回数据有时候最高价小于开盘价，前端容错 */
              high: Number(item[1]) < Number(item[0]) ? Number(item[0]) : Number(item[1]),
              low: Number(item[2]) > Number(item[3]) ? Number(item[3]) : Number(item[2]),
              close: Number(item[3]),
              volume: Number(item[4]),
              quoteVolume: Number(item[5]),
            }
            klineData.push(barValue)
          })

          const _klineData = sortMarketChartData(klineData) || []

          let meta = {
            noData: !(klineData.length > 0),
            // nextTime: Number(_klineData[_klineData.length - 1].time / 1000),
          }
          // console.log('_klineData', _klineData)
          if (_klineData?.length) {
            onHistoryCallback(_klineData)
          }
          // onHistoryCallback(_klineData, meta)

          if (firstDataRequest) {
            // 历史 K 线绘制完成后开启订阅
            baseMarketStore.getState().updateCoinHistoryKline({
              r: time,
              t: new Date().getTime(),
            })
          }
        } else {
          onHistoryCallback([], { noData: true })
        }
      }
    })
    .catch(err => {
      console.log('tradingview error', err)

      onHistoryCallback([], { noData: true })
    })
}

/**
 * 订阅 K 线数据。图表库将调用 onRealtimeCallback 方法以更新实时数据。
 */
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  listenerGUID,
  onResetCacheNeededCallback
) {
  // if (baseMarketStore.getState().klineCallback?.close) {
  //   onRealtimeCallback(baseMarketStore.getState().klineCallback)
  // }
  baseMarketStore.getState().updateKlineCallback(onRealtimeCallback)
}

/**
 * 取消订阅 K 线数据。在调用 subscribeBars 方法时，图表库将跳过与 subscriberUID 相同的对象。
 */
Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
  baseMarketStore.getState().updateKlineCallback(null)
}

/**
 * 获取服务器时间
 * @param callback
 */
Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
  let timestamp = new Date().getTime()
  callback(timestamp)
}

export default Datafeeds
