// import React from 'react'
// import { useCommonStore } from '@/store/index'

// import Series from './components/series'
// import './series.css'

// export interface SeriesChartData {
//   time: number // 13 位时间戳
//   value: number
//   [key: string]: any
// }

// const initialData: Array<SeriesChartData> = [
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

// // const initialData: Array<SeriesChartData> = [
// //   { time: 1660003200020, value: 0.0001 },
// //   { time: 1659974400000, value: 0.0001 },
// //   { time: 1659945600006, value: 0.0000279 },
// //   { time: 1659916800009, value: 0.0001 },
// //   { time: 1659888000014, value: 0.00002401 },
// //   { time: 1659859200000, value: -0.00000737 },
// //   { time: 1659830400013, value: 0.0001 },
// //   { time: 1659801600015, value: 0.0001 },
// //   { time: 1659772800000, value: 0.00008589 },
// //   { time: 1659744000021, value: 0.00006888 },
// //   { time: 1659715200000, value: 0.00002115 },
// //   { time: 1659686400000, value: 0.00006774 },
// //   { time: 1659657600005, value: 0.00001692 },
// //   { time: 1659628800015, value: 0.00001436 },
// //   { time: 1659600000009, value: 0.00001778 },
// //   { time: 1659571200001, value: -0.00000191 },
// //   { time: 1659542400008, value: 0.00004382 },
// //   { time: 1659513600020, value: -0.0000396 },
// //   { time: 1659484800001, value: 0.00000328 },
// //   { time: 1659456000014, value: 0.00005885 },
// // ].reverse()

// function App() {
//   const commonState = useCommonStore()

//   return (
//     <div className="series">
//       <Series seriesData={initialData} theme={commonState.theme} />
//     </div>
//   )
// }

// export default App
