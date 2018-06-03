import {
  $detailContent, $actionSheet, $toast, $dialog, $loginDialog
} from '../../components/wxcomponents'
var coordtransform = require('../../utils/coordtransform');
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {
        plot_id: null,
        showScodeimg: false,
        isFinished: false,
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        /**
         * tab切换
         */
        currentTab: 0,
        wx_image: '',
        toView: '',
        default_img: '',
        title: '',
        needLogin:false
    },
    onLoad: function (options) {
        var self = this;
        let plot_id = options.id;
        self.setData({plot_id: plot_id});
        /**
         * 新房详细页接口
         */
        // app.getUserOpenId().then(res => {
        //     self.setData({
        //         userInfo: app.globalData.userInfo
        //     });
        //     if (res.open_id) {
        //         //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
        //         $dialog.alert({
        //             title: '经纪圈新房通',
        //             content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
        //             buttons: [{
        //                 text: '知道了',
        //                 type: 'weui-dialog__btn_primary',
        //             }],
        //             onConfirm(e) {
        //             },
        //         })
        //     }
        // });
    },
    onShow: function () {
        let self = this;
        let plot_id = self.data.plot_id;
        let uid = app.globalData.customInfo.id;
        self.getMplotDetail(plot_id,uid);
    },
    getMplotDetail(plot_id,uid){
        let self =this;
        api.getMplotDetail({
            id: plot_id,
            uid: uid
        }).then(res => {
            let data = res.data.data;
            if (res.data.status === 'success') {
                self.setData({plotdetail: data});
                self.setData({title: data.title});
                wx.setNavigationBarTitle({title: data.title});//设置导航条标题
                console.log(self.data.plotdetail.hx)
                /**
                 *初始化轮播图
                 */
                self.setData({
                    coverswiper: {
                        imgUrls: data.images,
                        swiper_data_num: data.images.length,
                        swiperCurrent: 0
                    }
                });
                /**
                 *初始化组件 最新动态、雇佣规则、带看规则、楼盘卖点
                 */
                $detailContent.init('news', {
                    content: data.news.trim()
                });
                $detailContent.init('dk', {
                    content: data.dk_rule.trim()
                });
                $detailContent.init('sell', {
                    content: data.sell_point.trim()
                });
                if (data.pay.length !== 0) {
                    $detailContent.init('pay', {
                        content: (data.pay[0].title + data.pay[0].content).trim()
                    });
                }

                /*
                 * 同区域楼盘
                 */
                let params = {limit: 6, street: data.streetid}
                self.getAreaPlotList(params);

            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 1000,
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000);
            }
        });
    },
    /**
     *
     */

    /**
     * 同区域楼盘
     * @param params
     */
    getAreaPlotList: function (params) {
        let self = this;
        api.getXfList(params).then(res => {
            let data = res.data.data;
            self.setData({
                area_plot: data.list
            });
        });
        //隐藏加载logo
        self.setData({
            isFinished: true
        })
    },
    /**
     * 查看大图
     * @param {String} cur 当前展示图片
     * @param {Array}  imageList 展示的图片列表
     */
    seeHx(e) {
        wx.previewImage({urls: [e.currentTarget.dataset.current]});
    },

    /**
     * 滑动轮播图
     * @param e
     */
    swiperChange: function (e) {
        let that = this;
        that.setData({
            [`coverswiper.swiperCurrent`]: e.detail.current
        });
    },
    /**
     * 查看大图
     * @param {String} cur 当前展示图片
     * @param {Array}  imageList 展示的图片列表
     */
    viewPic(e) {
        let cur = e.currentTarget.dataset.current;
        let urls = e.currentTarget.dataset.urls;
        let imageList = [];
        urls.forEach(item => {
            imageList.push(item.url)
        })
        console.log(cur)
        wx.previewImage({
            current: cur,
            urls: imageList
        });
    },
    /**
     * 查看大图 -主力户型
     * @param {String} cur 当前展示图片
     */
    hxviewPic(e) {
      let cur = e.currentTarget.dataset.current;
      let imageList = [];
      imageList.push(cur)
      wx.previewImage({
        current: cur,
        urls: imageList
      });
    },

    /**
     * 分销和打电话
     * @returns {boolean}
     */
    tapSheet(e) {
        let self = this, type = e.currentTarget.dataset.type;
        $actionSheet.show(type, {
            titleText: type == 'phone' ? '电话' : '分销',
            hid: self.data.plotdetail.id,
            list: self.data.plotdetail.phones,
            onActionSheetClick(type, params) {
                if (!app.globalData.isTrue) {
                    // let url = '/pages/add_message/add_message';
                    // app.goPage(url, null, false);
                    // return;
                  self.setData({
                    needLogin: true
                  });
                }
                if (type == 'phone') {
                    let fxphone = app.globalData.phone;
                    console.log(app.globalData);
                    if(!fxphone) {
                      fxphone = app.globalData.customInfo.phone;
                    }
                    if (fxphone) {
                      api.callPhone({ hid: self.data.plotdetail.id, key: params.phone, fxphone: fxphone }).then(res => {
                        wx.makePhoneCall({
                          phoneNumber: params.phone
                        });
                      });
                    } else {
                      wx.makePhoneCall({
                        phoneNumber: params.phone
                      });
                    }
                    
                    
                } else if (type == 'fenxiao') {
                    api.addCo(params).then(res => {
                        $toast.show({
                            timer: 2e3,
                            text: res.data.msg,
                            success: () => console.log('文本提示')
                        });
                    })
                }
            }
        })

    },
    go_home(){
        app.goPage('/pages/index/index', null, true);
    },
    /**
     * 前往个人中心
     */
    toMy() {
        let url = '/pages/my/my';
        app.goPage(url, null, false);
    },
    /**
     * 查看地图
     */
    go_mapDetail(e) {
        let dataset = e.currentTarget.dataset;
        //百度经纬度坐标转国测局坐标
        var bd09togcj02 = coordtransform.bd09togcj02(dataset.lng, dataset.lat);
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                wx.openLocation({
                    latitude: Number(bd09togcj02[1]),
                    longitude: Number(bd09togcj02[0]),
                    scale: 16,
                    name: dataset.name,
                    address: dataset.address,
                    success: function (res) {
                        console.log(res)
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            }
        })
    },
    /**
     * 添加及取消收藏
     */
    addCollect(e) {
        let self = this, isTrue = app.globalData.isTrue, dataset = e.currentTarget.dataset;

        let params = {
            hid: dataset.hid,
            uid: app.globalData.customInfo.id
        };

        if (!isTrue) {
          self.setData({
            needLogin: true
          });
            // app.goPage('/pages/add_message/add_message', null, false);
        } else {
            api.addCollection(params).then(function (res) {
                let data = res.data
                $toast.show({
                    timer: 2e3,
                    text: data.msg,
                    success: () => console.log('文本提示')
                });
                if (data.status == 'success') {
                    if (self.data.plotdetail.is_save == 0) {
                        self.setData({
                            [`plotdetail.is_save`]: 1
                        })
                    } else if (self.data.plotdetail.is_save == 1) {
                        self.setData({
                            [`plotdetail.is_save`]: 0
                        })
                    }
                }else{
                    setTimeout(function () {
                        app.goPage('/pages/add_message/add_message', null, false);
                    }, 2e3);
                }
            });
        }
    },
    /**
     * 快速报备
     */
    filterCom(e) {
        let dataset = e.currentTarget.dataset, url = '/pages/index/index';
        app.goPage(url, dataset, false);
    },
    /**
     * 快速报备
     */
    baoBei(e) {
        if (!app.globalData.isTrue) {
          let self = this;
          self.setData({
            needLogin: true
          });
        }else{
            let dataset = e.currentTarget.dataset, url = '/pages/house_baobei/house_baobei';
            app.goPage(url, {id: dataset.id}, false);
        }

    },
    /**
     * 筛选公司并跳转首页
     */
    doFilterCom(e){
        let dataset = e.currentTarget.dataset, url = '/pages/index/index';
        app.goPage(url, dataset, false);
    },
    /**
     * 跳转详细页
     */
    goToDetail(e){
        let dataset = e.currentTarget.dataset, url = '/pages/house_detail/house_detail';
        app.goPage(url, {id:dataset.id}, false);
    },
    /**
     * 详细页转发分享
     * @param res
     * @returns {{title: string, path: string}}
     */
    onShareAppMessage(res) {
       let self= this;
        return {
          title: self.data.title,
            path: 'pages/house_detail/house_detail?id='+self.data.plot_id
        }
    },
     /**
     * 微信授权，获取用户信息
     * @param resuserinfo
     */
    onGotUserInfo(resuserinfo) {
      console.log(resuserinfo)
      let self = this;
      wx.login({
        success: function (loginres) {
          app.globalData.userInfo = resuserinfo.detail.userInfo;
          api.getOpenId({ code: loginres.code }).then(res => {
            let data = res.data;
            self.closeDialog();
            app.globalData.wxData = data;
            //新用户
            if (!data.is_true){
              //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
              $dialog.alert({
                title: '经纪圈新房通',
                content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                buttons: [{
                  text: '知道了',
                  type: 'weui-dialog__btn_primary',
                }],
                onConfirm(e) {
                },
              })
             
            } else {
              app.globalData.isTrue = true;
            }
         
          })

        }
      })
    },
    /**
    * 关闭授权框
    */
    closeDialog() {
      let self = this;
      self.setData({
        needLogin: false
      });
    },
    goMobileLogin(){
      let url = '/pages/login_mobile/login_mobile';
      app.goPage(url, null, false);
      return;
    }
    

});
