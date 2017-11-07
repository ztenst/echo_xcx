//app.js
var api = require('./common/api');

App({
    onLaunch: function () {
    },
    onShow: function () {
        let that = this;
        var res = wx.getSystemInfoSync();
        wx.setStorageSync('kScreenW', res.windowWidth);
        wx.setStorageSync('kScreenH', res.windowHeight);
    },
    onError: function (msg) {
        console.log(msg)
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
                                self.globalData.userInfo = res.userInfo
                                resolve(res.userInfo)
                            }
                        })
                    }
                })
            }
        })
    },
    getSiteConfig: function (forceUpdate = false) {
        var self = this
        return new Promise((resolve, reject) => {
            if (self.globalData.siteConfig && !forceUpdate) {
                resolve(self.globalData.siteConfig)
            } else {
                api.getSiteConfig().then(res => {
                    self.globalData.siteConfig = res.data.data;
                    resolve(res.data.data)
                }).catch(err => {
                    reject(err)
                });
            }
        });
    },
    getLocation: function (cb) {
        var self = this;
        if (this.globalData.latitude && this.globalData.longitude) {
            typeof cb === 'function' && cb(this.globalData.latitude, this.globalData.longitude)
        } else {
            wx.getLocation({
                success(json) {
                    self.globalData.latitude = json.latitude;
                    self.globalData.longitude = json.longitude;
                    typeof callback === 'function' && callback(json.latitude, json.longitude);
                }
            })
        }
    },
    //刷新地理坐标位置
    updateLocation: function () {
        let self = this;
        wx.getLocation({
            success(json) {
                self.globalData.latitude = json.latitude;
                self.globalData.longitude = json.longitude;
            }
        })
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
                            api.getWeOpenid(res.code).then(res => {
                                let data = res.data.data;
                                // console.log('拉取openid成功', data.openid);
                                wx.setStorageSync('user', {
                                    openid: data.openid,
                                    expires_in: Date.now() + data.expires_in
                                });
                                self.globalData.wxData.openid = data.openid;//存储openid 
                                resolve(data.openid);
                            })
                        }
                    })
                }
            // }
        });
    },
    globalData: {
        userInfo: null,
        latitude: null,
        longitude: null,
        siteConfig: null,
        wxData: {
            openid: '',
        }
    }
})