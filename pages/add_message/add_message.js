import {
    $toast
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {
      phone:'',
    },
    onLoad: function (options) {
      let phone = app.globalData.phone
      let that = this;
      this.setData({
        phone: phone
      });
    },
    getPhone(e) {
        let that = this;
        that.setData({
            userphone: e.detail.value
        });
    },
    getName(e) {
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
    getType(e) {
      let that = this;
      that.setData({
        userType: e.detail.value
      });
    },
    addMes: function (e) {
   
        let that = this,
            fObj = e.detail.value
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
        const pack = {
            openid:app.globalData.wxData.open_id,
            userphone: parseInt(fObj.userphone),
            name: fObj.name,
            usercompany: fObj.usercompany,
            userType: that.data.userType,
        }
     
        api.addMessage(pack).then((res) => {
            let data = res.data;
            $toast.show({
                timer: 2e3,
                text: data.msg,
            });
            if (data.status == 'success') {
                app.globalData.isTrue = true;
                console.log(app.globalData.isTrue)
                let dataset = e.currentTarget.dataset, url = '/pages/index/index';
                app.goPage(url, dataset, false);
                // setTimeout(function () {
                //     app.getUserOpenId('fresh').then(res =>{});
                //     wx.navigateBack({
                //         delta: 1
                //     })
                // }, 2e3);
            }
        })
    }

});
