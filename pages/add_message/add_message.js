import {
    $toast
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

const qiniuUploader = require("../../utils/qiniuUploader");
function getKey() {
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  var key = '';
  var time = new Date().getTime();
  var Range = 999999 - 100000;
  var Rand = Math.random();
  var num = 100000 + Math.round(Rand * Range);
  return key + myDate.getFullYear() + '/' + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day) + '/' + new Date().getTime() + num + '.jpg';
}

let app = getApp();

Page({
    data: {
      phone:'',
      isCompany:false,
      cardImg:'http://oofuaem2b.bkt.clouddn.com/2018/0606/1528272552258587218.jpg'
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
      if (e.detail.value == 3){
        that.setData({
          isCompany: false
        });
      }else{
        that.setData({
          isCompany: true
        });
      }
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

        if (that.data.cardImg) {
          $toast.show({
            timer: 2e3,
            text: '选择身份证照片',
          });
          return false;
        }
        const pack = {
            openid:app.globalData.wxData.open_id,
            userphone: parseInt(fObj.userphone),
            name: fObj.name,
            usercompany: fObj.usercompany,
            userType: that.data.userType,
            id_pic: that.data.cardImg
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
    },
    // 选择图片
    chooseCard: function (){
      wx.chooseImage({
        count: 1,
        success(res) {
          var filePath = res.tempFilePaths[0];
          // 交给七牛上传
          qiniuUploader.upload(filePath, (res) => {
            console.log(`http://` + res.imageURL)
            let that = this;
            that.setData({
              cardImg: `http://` + res.imageURL
            });
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
            $toast.show({
              timer: 2e3,
              text: 'error: ' + JSON.stringify(error),
            });
          }
            , {
              region: 'NCN', // 华北区
              domain: 'oofuaem2b.bkt.clouddn.com',
              uptokenURL: 'https://meat.madridwine.cn/api/image/qnUpload',
              shouldUseQiniuFileName: false,
              key: getKey(),
            }
          );
        }
      })
    },
    //删除图片
    deleteUploadImg(e) {
      const dataset = e.currentTarget.dataset
      this.setData({
        cardImg: ''
      })
    },

});
