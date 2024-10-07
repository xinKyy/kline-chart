var DeptChartSpecieEnum;
(function (DeptChartSpecieEnum) {
  DeptChartSpecieEnum["Dept"] = "dept";
  DeptChartSpecieEnum["DeptCurrent"] = "deptCurrent";
})(DeptChartSpecieEnum || (DeptChartSpecieEnum = {}));
var TimeSharingType;
(function (TimeSharingType) {
  TimeSharingType["Min"] = "m";
  TimeSharingType["Hour"] = "h";
  TimeSharingType["Day"] = "D";
  TimeSharingType["Week"] = "W";
  TimeSharingType["Mon"] = "M";
  TimeSharingType["Second"] = "s";
})(TimeSharingType || (TimeSharingType = {}));
var KLineChartType;
(function (KLineChartType) {
  KLineChartType["Quote"] = "quote";
  KLineChartType["ContractFunding"] = "contractFunding";
  KLineChartType["Futures"] = "futures";
  KLineChartType["Ternary"] = "ternary-option";
})(KLineChartType || (KLineChartType = {}));
export { DeptChartSpecieEnum, KLineChartType, TimeSharingType };
