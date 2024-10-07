import React from 'react'
import Dept from './components/dept'

export enum DeptChartSpecieEnum {
  Dept = 'dept',
  DeptCurrent = 'deptCurrent',
}

export enum TradeDirectionEnum {
  Buy = 'dept',
  Sell = 'sell',
}
export interface DeptChartData {
  time: number // 13 位时间戳
  value: number // 值
  direction?: TradeDirectionEnum // 买卖方向
  [key: string]: any
}

// const initialData: Array<DeptChartData> = [
//   { value: 11, time: 1659411240000 },
//   { value: 2, time: 1659411300000 },
//   { value: -1.1, time: 1659411360000 },
//   { value: -1.2, time: 1659411420000 },
//   { value: -1.3, time: 1659411480000 },
//   { value: 0.4, time: 1659411540000 },
//   { value: 0.6, time: 1659411600000 },
//   { value: 1.2, time: 1659411660000 },
//   { value: -1.5, time: 1659411720000 },
//   { value: -1.7, time: 1659411780000 },
// ]
const initialData: Array<DeptChartData> = [
  { value: 11, time: 100, direction: TradeDirectionEnum.Buy },
  { value: 2, time: 200, direction: TradeDirectionEnum.Buy },
  { value: 22, time: 300, direction: TradeDirectionEnum.Buy },
  { value: 33, time: 400, direction: TradeDirectionEnum.Buy },
  { value: 0, time: 500, direction: TradeDirectionEnum.Buy },
  { value: 55, time: 500, direction: TradeDirectionEnum.Sell },
  { value: 44, time: 700, direction: TradeDirectionEnum.Sell },
  { value: 100, time: 800, direction: TradeDirectionEnum.Sell },
  { value: 123, time: 900, direction: TradeDirectionEnum.Sell },
  { value: 4, time: 1000, direction: TradeDirectionEnum.Sell },
]

function App() {
  return (
    <div>
      <Dept deptData={initialData} type={DeptChartSpecieEnum.DeptCurrent} theme={'Light'} />
    </div>
  )
}

export default App
