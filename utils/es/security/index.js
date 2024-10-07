/**
 * 获取安全的 url 防御 xss 攻击
 */
function getSecurityUrl(url) {
  return url.replace(/[\s<>()"'`]*(%20|%3C|%3E|%22)*/g, '');
}
/**
 * 针对单层级对象进行 xss 防御
 */
function getSecuritySingleMap(obj) {
  var res = {};
  Object.keys(obj).forEach(function (k) {
    res[k] = getSecurityUrl(obj[k]);
  });
  return res;
}
export { getSecuritySingleMap, getSecurityUrl };
