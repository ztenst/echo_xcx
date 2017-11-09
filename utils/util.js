function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTime2(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 * 过滤特殊字符
 */
function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function params2Query(params) {
  let q = [];
  for (let i in params) {
    q.push(`${i}=${params[i]}`)
  }
  return q.join('&');
}

function query2Params(query) {
  let p = {};
  let q = query.split('&');
  q.forEach(item => {
    let arr = item.split('=');
    let [i, j] = [arr[0], arr[1]];

    if (arr.length === 0 || j === 'null') {
      p[i] = null;
    } else if (j === 'true') {
      p[i] = true;
    } else if (j === 'false') {
      p[i] = false;
    } else if (j === 'undefined') {
      p[i] = undefined;
    } else if (j === 'NaN') {
      p[i] = NaN;
    } else if (/^-?(0|([1-9]\d*))?(\.\d+)?$/.test(j) && !isNaN(parseFloat(j))) {
      p[i] = parseFloat(j);
    } else {
      p[i] = j;
    }
  });

  return p;
}

function decodeKeys(obj) {
  let _obj = {}
  for (let i in obj) {
    _obj[i] = typeof obj[i] === 'string' ? decodeURIComponent(obj[i]) : obj[i]
  }
  return _obj
}

/**
 * 过滤掉数据里的undefined和null和空字符串
 */
function filterEmpty(data = {}) {
  let obj = Object.assign(data);
  for (let i in obj) {
    if (obj[i] === '' || obj[i] === undefined || obj[i] === null) {
      delete obj[i]
    }
  }
  return obj;
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
    stripscript: stripscript,
  params2Query: params2Query,
  query2Params: query2Params,
  decodeKeys: decodeKeys,
  filterEmpty: filterEmpty
}