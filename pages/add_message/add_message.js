import {$toast
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {},
    onLoad: function (options) {

    },
    getPhone(e){
        let that = this;
        that.setData({
            userphone: e.detail.value
        });
    },
    getName(e){
        let that = this;
        that.setData({
            name: e.detail.value
        });
    },
    getCompanyName(e) {
        let that = this;
        that.setData({
            usercompany: e.detail.value
        });
    },

    addMes: function (e) {
        let that = this,
            fObj = e.detail.value;

        if (!fObj.name) {
            $toast.show({
                timer: 2e3,
                text: '请输入客户姓名',
            });
            return false;
        }
        if (!/^\d{11}$/.test(fObj.userphone)) {
            $toast.show({
                timer: 2e3,
                text: '手机号错误',
            });
            return false;
        }
        if (!fObj.usercompany) {
            $toast.show({
                timer: 2e3,
                text: '请输入公司名',
            });
            return false;
        }
        const pack = {
            userphone: parseInt(fObj.userphone),
            name: fObj.name,
            usercompany: fObj.usercompany,
        }

        api.addMessage(pack).then((res) => {
            let data = res.data;
            $toast.show({
                timer: 2e3,
                text: data.msg,
            });
            if (data.status == 'success') {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 2e3);
            }
        })
    }

});
