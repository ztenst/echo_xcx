//app.js
var api = require('./common/api');

App({
    onLaunch: function () {

    },
    // getUserInfo: function () {
    //     var self = this
    //     return new Promise((resolve, reject) => {
    //         // if (Object.keys(self.globalData.userInfo).length != 0) {
    //         //     resolve(self.globalData.userInfo)
    //         // } else {
    //             //调用登录接口
    //             wx.login({
    //                 success: function () {
    //                     wx.getUserInfo({
    //                         success: function (res) {
    //                             console.log(res.userInfo)
    //                             self.globalData.userInfo = res.userInfo;
    //                             resolve(res.userInfo)
    //                         }
    //                     })
    //                 }
    //             })
    //         // }
    //     })
    // },
    /**
     * 获取openid 
     * @returns {Promise}
     */
    getUserOpenId: function (status) {
        var self = this;
        //不要在30天后才更换openid-尽量提前10分钟更新 
        return new Promise((resolve, reject) => {
            //  console.log(Object.keys(self.globalData.userInfo).length != 0)
            console.log(self.globalData.isTrue)
            if (!self.globalData.isUser || status == 'fresh') {
                wx.login({
                    success: function (loginres) {
                        wx.getUserInfo({
                            success: function (resuserinfo) {
                                self.globalData.userInfo = resuserinfo.userInfo;
                                api.getOpenId({code:loginres.code}).then(res => {
                                    let data = res.data;
                                    self.globalData.customInfo = data;

                                    // console.log(data)
                                    //如果没有open_id说明是新用户
                                    if(!data.open_id){
                                        self.globalData.customInfo = data;
                                        self.globalData.isUser = true;
                                        self.globalData.isTrue = data.is_true=='1' ? true : false;
                                    }else{
                                        self.globalData.wxData=data;
                                    }
                                    resolve(data);
                                })
                            }
                        });
                    }
                })
            } else {
                resolve(self.globalData);
            }
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
        userInfo: {},
        customInfo:{},
        isUser:false,
        isTrue:false,
        wxData: {},
        phone:'',
    }
})