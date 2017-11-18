// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)

function formatTime(Date,fmt) {
    var o = {
        "M+": Date.getMonth() + 1, //月份
        "d+": Date.getDate(), //日
        "h+": Date.getHours(), //小时
        "m+": Date.getMinutes(), //分
        "s+": Date.getSeconds(), //秒
        "q+": Math.floor((Date.getMonth() + 3) / 3), //季度
        "S": Date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (Date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTime2(number, format) {
    var date = new Date(number); //获取一个时间对象
  return formatTime(date,format);
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

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
    stripscript: stripscript,
  params2Query: params2Query,
  query2Params: query2Params,
  decodeKeys: decodeKeys,
  filterEmpty: filterEmpty,
    isObjectEmpty:isObjectEmpty
}