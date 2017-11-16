/* eslint-disable camelcase,spaced-comment,no-undef,comma-spacing */
import config from '../config'
import Util from '../utils/util'

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

/**
 * 微信请求promise化
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function wxPromisify(fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                //成功
                resolve(res)
            }
            obj.fail = function (res) {
                //失败
                reject(res)
            }
            fn(obj)
        })
    }
}

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data = {}) {
    var getRequest = wxPromisify(wx.request)
    return getRequest({
        url: url,
        method: 'GET',
        data: Util.filterEmpty(data),
        header: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data = {}) {
    var postRequest = wxPromisify(wx.request)
    return postRequest({
        url: url,
        method: 'POST',
        data: Util.filterEmpty(data),
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
    })
}

const api = {
    //新房详细页
    getMplotDetail: function getMplotDetail(id) {
        var url = `${config.host}/api/plot/info`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    //取得搜索筛选区域条件
    getTagsIndex(cate) {
        let url = `${config.host}/api/tag/index`
        return getRequest(url,{cate})
    },
    //取得搜索筛选房价、户型、其他条件
    getFilterTags(cate) {
        let url = `${config.host}/api/tag/list`
        return getRequest(url, {cate})
    },
    /*新房列表*/
    getXfList(params) {
        let url = `${config.host}/api/plot/list`
        return getRequest(url, params)
    },
    /*新房列表*/
    getUserInfo(params) {
        let url = `${config.host}/api/index/getUserInfo`
        return postRequest(url, params)
    },
    /*新房列表*/
    getDecode(params) {
        let url = `${config.host}/api/index/decode`
        return postRequest(url, params)
    },
    /*获取openid*/
    getOpenId(params) {
        let url = `${config.host}/api/index/getOpenId`
        return getRequest(url, params)
    },
    /*新房列表*/
    xcxLogin(params) {
        let url = `${config.host}/api/index/xcxLogin`
        return postRequest(url, params)
    },
    /*分销*/
    addCo(params) {
        let url = `${config.host}/api/index/addCo`
        return postRequest(url, params)
    },
    /*完善资料*/
    addMessage(params) {
        let url = `${config.host}/api/index/completeInfo`
        return postRequest(url, params)
    },
    /*完善资料*/
    baiBei(params) {
        let url = `${config.host}/api/index/sub`
        return postRequest(url, params)
    },
    /*收藏*/
    addCollection(params) {
        let url = `${config.host}/api/index/addsave`
        return getRequest(url, params)
    },
};

module.exports = api