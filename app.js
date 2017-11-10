//app.js
var api = require('./common/api');

App({
    onLaunch: function () {
    },

    /**
     * 页面跳转 pageUrl 页面路径，isForceNavigateTo 是否强制使用NavigateTo来跳转
     * 需要注意的是 传递页面的参数时只能是字字符串
     * @param pageUrl
     * @param data
     * @param idForceNavigateTo
     */
    goPage: function (pageUrl, data, idForceNavigateTo) {
        //如果传了data 就做参数的拼接
        if (data != null) {
            let param = Object.keys(data)
                .map(key => key + '=' + data[key])
                .join('&');
            pageUrl = pageUrl + "?" + param;
        }
        if (idForceNavigateTo || getCurrentPages().length < 4) {
            wx.navigateTo({url: pageUrl});
        } else {
            wx.redirectTo({url: pageUrl})
        }
    }
})