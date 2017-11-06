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
    //站点配置
    getSiteConfig: function () {
        var url = `${config.host}/api/resoldwapapi/commonsiteconfig`;
        return getRequest(url)
    },
    //房源相册
    getHouseImages: function getHouseImages(fid, type, is_cut) {
        var url = `${config.host}/api/resoldwapapi/commonimage`;
        var params = {
            'fid': fid,
            'type': type,
            'is_cut': is_cut
        };
        return getRequest(url, params)
    },
    //二手房详细页
    getEsfInfo: function getEsfInfo(id) {
        var url = `${config.host}/api/resoldwapapi/esfinfo`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    //新房详细页
    getMplotDetail: function getMplotDetail(id) {
        var url = `${config.host}/api/resoldwapapi/mplotdetail`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    //租房详细页
    getZfInfo: function getMplotDetail(id) {
        var url = `${config.host}/api/resoldwapapi/zfinfo`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    //小区详细页接口
    getPlotInfo: function getPlotInfo(id) {
        var url = `${config.host}/api/resoldwapapi/plotinfo`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    //二手房楼盘的价格趋势
    getPlotChart: function (hid) {
        var url = `${config.host}/api/resoldwapapi/plotchart`;
        var params = {
            'hid': hid
        };
        return getRequest(url, params)
    },
    //新房楼盘的价格趋势
    getMplotPrice: function (id) {
        var url = `${config.host}/api/resoldwapapi/mplotprice`;
        var params = {
            'id': id
        };
        return getRequest(url, params)
    },
    staff: function (uid) {
        var url = `${config.host}/api/resoldwapapi/staffindex`;
        var params = {
            'uid': uid
        };
        return getRequest(url, params)
    },
    getBorrow: function (total) {
        var url = `${config.host}/api/resoldwapapi/borrow`;
        var params = {
            'total': total
        };
        return getRequest(url, params)
    },
    getDetailTag: function (cate) {
        var url = `${config.host}/api/resoldwapapi/newtags`;
        var params = {
            'cate': cate
        };
        return getRequest(url, params)
    },
    //报名
    getMorder: function (params) {
        var url = `${config.host}/api/resoldwapapi/morder`;
        var params = params;
        return postRequest(url, params)
    },
    //获取token
    getWeOpenid: function (code) {
        var url = `${config.host}/api/resoldwapapi/weopenid`
        var params = {
            'code': code
        };
        return postRequest(url,params)
    },


    //首页图片, 推荐房源
    getIndexInfo() {
        let url = `${config.host}/api/resoldwapapi/mindex`
        return getRequest(url)
    },
    //新房热搜
    getXfSearchHots() {
        let url = `${config.host}/api/resoldwapapi/msearchhot`
        return getRequest(url)
    },
    //二手房、租房热搜
    getEsfSearchHots(cate) {
        let url = `${config.host}/api/resoldwapapi/commonrecom`
        return getRequest(url, {cate})
    },
    //取得搜索联想
    getSearchTips(kw) {
        let url = `${config.host}/api/resoldwapapi/mplotsearch`
        return getRequest(url, {kw})
    },
    //取得搜索筛选区域条件
    getFilterAreas() {
        let url = `${config.host}/api/resoldwapapi/commonplace`
        return getRequest(url)
    },
    //取得搜索筛选房价、户型、其他条件
    getFilterTags(cate) {
        let url = `${config.host}/api/resoldwapapi/newtags`
        return getRequest(url, {cate})
    },
    /*新房列表*/
    getXfList(params) {
        let url = `${config.host}/api/resoldwapapi/mplotlist`
        return getRequest(url, params)
    },
    /*二手房列表*/
    getEsfList(params) {
        let url = `${config.host}/api/resoldwapapi/esflist`
        return getRequest(url, params)
    },
    /*租房列表*/
    getZfList(params) {
        let url = `${config.host}/api/resoldwapapi/zflist`
        return getRequest(url, params)
    },
    /*查询新房价趋势*/
    getXfPriceTrend() {
        let url = `${config.host}/api/resoldwapapi/mnewpricetrend`
        return getRequest(url)
    },
    /*查询二手房价趋势*/
    getEsfPriceTrend() {
        let url = `${config.host}/api/resoldwapapi/pricetrend`
        return getRequest(url)
    },

};

module.exports = api