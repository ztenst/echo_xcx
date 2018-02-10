import api from '../../common/api'

let app = getApp();

Page({
    data: {
        expireTime: '',
        price: 1099,
        priceList: [
            {
                title: '2年VIP会员(限时特惠)',
                isTuijian: true,
                old_price: 1999,
                new_price: 1099,
            },
            {
                title: '1年VIP会员(限时特惠)',
                old_price: 999,
                new_price: 699,
            },
            {
                title: '6年VIP会员(限时特惠)',
                new_price: 499,
            },
            {
                title: '3年VIP会员(限时特惠)',
                new_price: 299,
            }
        ]
    },
    onShow() {
        let self = this;
        app.getUserOpenId().then(res => {
            self.setData({
                customInfo: app.globalData.customInfo,
                userInfo: app.globalData.userInfo,
            });
            api.getExpire({uid: app.globalData.customInfo.id}).then(data => {
                let json = data.data;
                if (json.status == 'success') {
                    this.setData({
                        expireTime: json.data
                    })
                }
            });
        });
    },
    goToList(e) {
        let dataset = e.currentTarget.dataset, url = '', UID = app.globalData.customInfo.id;
        if (!app.globalData.isTrue) {
            let url = '/pages/add_message/add_message';
            app.goPage(url, null, false);
        } else {
            if (dataset.type == 'collect') {
                url = '/pages/collection_list/collection_list';

            } else if (dataset.type == 'baobei') {
                url = '/pages/baobei_list/baobei_list';
            }
            app.goPage(url, {uid: UID}, false);
        }
    },
    getPhone() {
        api.getPhone().then(res => {
            wx.makePhoneCall({
                phoneNumber: res.data.data
            });
        });
    },
    fabuHouse() {
        let url = '/pages/myhouse_list/myhouse_list';
        app.goPage(url, {uid: 1}, false);
    },
    setPrice(e) {
        let dataset = e.currentTarget.dataset;
        this.setData({
            price: dataset.price,
        })
    },
    //生成随机函数
    createNonceStr() {
        return Math.random().toString(32).substr(2, 15)
    },
    //生成时间戳
    createTimeStamp() {
        return parseInt(new Date().getTime() / 1000) + ''
    },
    goPay() {
        let setPayParam = {
            price: this.data.price,
            openid: app.globalData.customInfo.openid
        }
        api.setPay(setPayParam).then(r => {
            let Json = r.data.data;
            wx.requestPayment({
                'timeStamp': Json.timeStamp,
                'nonceStr': Json.nonceStr,
                'package': Json.package,
                'signType': Json.signType,
                'paySign': Json.paySign,
                success(res) {
                    console.log(res);
                    let vipParams={num: 1, uid: app.globalData.customInfo.id, title: setPayParam.price};
                    api.setVip(vipParams).then(r => {
                        let json = r.data;
                        if (json.status == 'success') {
                            let url = '/pages/my/my';
                            app.goPage(url, null, false);
                        }
                    })
                },
                'fail': function (res) {
                }
            })
        })
    }
});
