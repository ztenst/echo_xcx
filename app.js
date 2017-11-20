//app.js
var api = require('./common/api');

App({
    onLaunch: function () {
        this.getUserInfo();
    },
    getUserInfo: function () {
        var self = this
        return new Promise((resolve, reject) => {
            if (self.globalData.userInfo) {
                resolve(self.globalData.userInfo)
            } else {
                //调用登录接口
                wx.login({
                    success: function () {
                        wx.getUserInfo({
                            success: function (res) {
                                self.globalData.userInfo = res.userInfo;
                                resolve(res.userInfo)
                            }
                        })
                    }
                })
            }
        })
    },
    /**
     * 获取openid 
     * @returns {Promise}
     */
    getUserOpenId: function () {
        var self = this;
        var user = wx.getStorageSync('user') || {};
        //不要在30天后才更换openid-尽量提前10分钟更新 
        return new Promise((resolve, reject) => {
            // if (typeof user == 'object' && !user.openid && (user.expires_in || Date.now()) < (Date.now() + 600)) {
            if (self.globalData.wxData.openid) {
                resolve(self.globalData.wxData.openid)
            } else {
                wx.login({
                    success: function (res) {
                        api.getOpenId({code:res.code}).then(res => {
                            let data = res.data.trim();
                            // console.log('拉取openid成功', data.openid);
                            self.globalData.wxData.openid = data;//存储openid 
                            resolve(data);
                        })
                    }
                })
            }
            // }
        });
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
    },
    globalData: {
        userInfo: null,
        siteConfig: null,
        isUser:false,
        wxData: {
            openid: '',
        },
    }
})