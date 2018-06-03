import {
  $toast
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
  data: {
    phone: '',
  },
  onLoad: function (options) {
    // let phone = app.globalData.phone
    // let that = this;
    // this.setData({
    //   phone: phone
    // });
  },
  getPhone(e) {
    let that = this;
    that.setData({
      phone: e.detail.value
    });
  },
  getCode(e) {
    let that = this;
    that.setData({
      code: e.detail.value
    });
  },

  setCode:function(e){
    let that = this,
      fObj = that.data;

    if (!/^\d{11}$/.test(fObj.phone)) {
      $toast.show({
        timer: 2e3,
        text: '手机号格式错误',
      });
      return false;
    }
    // 17717869003
    /**
     * 获取验证码
     * @param mobile
     */
    api.getSmsCode({ phone: fObj.phone}).then(res => { 
      if (res.data.status == 'success') {
        this.setData({
          codeDisabled: 'disabled'
        })
        $toast.show({
          timer: 2e3,
          text: '登录成功，请完善信息',
        });
      } else {
        $toast.show({
          timer: 2e3,
          text: '验证码发送失败',
        });
      }
    });
    
  },

  loginMobile: function (e) {
    let that = this,
      fObj = e.detail.value;

    if (!/^\d{11}$/.test(fObj.phone)) {
      $toast.show({
        timer: 2e3,
        text: '手机号格式错误',
      });
      return false;
    }
    if (!fObj.code) {
      $toast.show({
        timer: 2e3,
        text: '请输入验证码'
      });
      return false;
    }

    /**
     * 判断验证码
     * @param phone,code
     */
    api.checkCode({ phone: fObj.phone, code: fObj.code}).then((res) => {
      let data = res.data; 
      if (data.status == 'success') {
        app.globalData.phone = fObj.phone;
          /**
         * 判断用户是否存在
         * @param phone
         */
        api.getUserInfo({ phone: fObj.phone}).then((userRes) => {
          if (userRes.data.status == 'success') {
            app.globalData.customInfo = userRes.data.data;
          }else{
            let url = '/pages/add_message/add_message';
            app.goPage(url, null, false);
          }
        })
      }else{
        $toast.show({
          timer: 2e3,
          text: data.msg,
        });
      }
    })
  }

});
