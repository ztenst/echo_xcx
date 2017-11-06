var app = getApp();
var api = require('../../common/api');
import config from '../../config'
import $wuxtoast from '../../components/toast/toast'
Page({
    data: {
        showBMsuccess: false,
        plot_name: '',
        type: '',
        rid: null,
        leixing: '',
        checkboxitem: [{checked: true}]
    },
    changed: function (e) {
        let that = this;
        that.setData({
            checkboxitem: [{
                checked: !that.data.checkboxitem[0].checked
            },]
        })
    },
    onLoad(option){
        let that = this;
        app.getSiteConfig().then(siteConfig => {
            that.setData({
                site_name: siteConfig.site_name,
            });
            /**
             * 设置导航条标题
             */
            wx.setNavigationBarTitle({title: siteConfig.site_name + "房产"});
        });

        that.setData({
            plot_id: option.plotid,
            plot_name: option.plot_name,
            type: option.type,
            rid: option.rid,
            leixing: that.delType(option.type)
        });
    },
    delType: function (type) {
        switch (type) {
            case 'red':
                return '楼盘红包';
                break;
            case 'kan':
                return '看房团';
                break;
            case 'special':
                return '特价房';
                break;
            case 'tuan':
                return '特惠团';
                break;
            case 'discount':
                return '优惠通知';
                break;
            case 'priceoff':
                return '变价通知';
                break;
            case 'appoint' :
                return '预约看房';
                break;
            case 'open'  :
                return '看房团需求';
                break;

        }
    },
    getPhone(e){
        let that = this;
        that.setData({
            phone: e.detail.value
        });
    },
    getName(e){
        let that = this;
        that.setData({
            name: e.detail.value
        });
    },
    soonBM: function (e) {
        let that = this,
            reg1 = /^[0-9]{11}$/,
            fId = e.detail.formId,
            fObj = e.detail.value;
        if (!fObj.name) {
            $wuxtoast.show({
                type: 'text',
                timer: 2e3,
                text: '请填写正确姓名',
            });
            return false;
        }
        if (!reg1.test(fObj.telephone)) {
            $wuxtoast.show({
                type: 'text',
                timer: 2e3,
                text: '手机号错误',
            });
            return false;
        }
        if (!that.data.checkboxitem[0].checked) {
            $wuxtoast.show({
                type: 'text',
                timer: 2e3,
                text: '请选择阅读并同意',
            });
            return false;
        }
        app.getUserOpenId().then(openid => {
            const template_data = {
                touser: openid,
                template_id: config.template_id,//这个是1、申请的模板消息id，
                page: 'pages/house_detail/new_house_detail?id=' + that.data.plot_id,
                form_id: fId,
                data: {
                    "keyword1": {
                        "value": that.data.plot_name,
                    },
                    "keyword2": {
                        "value": that.data.leixing,
                    },
                    "keyword3": {
                        "value": fObj.name,
                    },
                    "keyword4": {
                        "value": fObj.telephone,
                    },
                    "keyword5": {
                        "value": `${that.data.site_name}房产顾问将会与您联系，请保持手机畅通。`,
                    },
                },
            }
            const pack = {
                phone: parseInt(fObj.telephone),
                name: fObj.name,
                type: that.data.type,
                rid: that.data.rid,
                plot_name: that.data.plot_name,
                template_data: JSON.stringify(template_data)
            }

            api.getMorder(pack).then((res) => {
                console.log(res)
                let data = res.data;
                if (data.status === "success") {
                    that.setData({
                        showBMsuccess: !that.data.showBMsuccess
                    });
                } else {
                    $wuxtoast.show({
                        type: 'text',
                        timer: 2e3,
                        text: data.msg,
                    });
                }
            })
        })
    }
})
