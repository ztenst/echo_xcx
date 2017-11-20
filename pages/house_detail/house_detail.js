import {
    $detailContent, $actionSheet, $toast
} from '../../components/wxcomponents'
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
    },
    onLoad: function (options) {
        var self = this;
        let plot_id = options.id;
        self.setData({plot_id: plot_id});
        /**
         * 新房详细页接口
         */
    },
    onShow: function () {
        let self = this;
        let plot_id = self.data.plot_id;
        let uid = app.globalData.userInfo.id;
        api.getMplotDetail({
            id:plot_id,
            uid:uid
        }).then(res => {
            let data = res.data.data;
            if (res.data.status === 'success') {
                self.setData({plotdetail: data});
                wx.setNavigationBarTitle({title: data.title});//设置导航条标题
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
                //隐藏加载logo
                self.setData({
                    isFinished: true
                })
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
        let self = this,type = e.currentTarget.dataset.type;

        $actionSheet.show(type, {
            titleText: type == 'phone' ? '电话' : '分销',
            hid: self.data.plotdetail.id,
            list: self.data.plotdetail.phones,
            onActionSheetClick(type, params) {
                if (!app.globalData.isUser) {
                    let url = '/pages/add_message/add_message';
                    app.goPage(url, null, false);
                    return;
                }
                if (type == 'phone') {
                    wx.makePhoneCall({
                        phoneNumber: params.phone
                    });
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
    /**
     * 添加及取消收藏
     */
    addCollect(e) {
        let self = this,isUser = app.globalData.isUser, dataset = e.currentTarget.dataset;

        let params = {
            hid: dataset.hid,
            uid: app.globalData.userInfo.id
        };

        if (!isUser) {
            app.goPage('/pages/add_message/add_message', null, false);
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

                }
            });
        }
    },
    /**
     * 快速报备
     */
    filterCom(e) {
        let dataset = e.currentTarget.dataset,url = '/pages/index/index';
        app.goPage(url, dataset, false);
    },
    /**
     * 快速报备
     */
    baoBei(e) {
        let dataset = e.currentTarget.dataset,url = '/pages/house_baobei/house_baobei';
        app.goPage(url, {id: dataset.id}, false);
    }
});
