import {
    $detailContent
} from '../../components/wxcomponents'
import detailCover from '../../detail/detail-cover/detail-cover';
var app = getApp();
var api = require('../../common/api');
var util = require('../../utils/util');


Page(Object.assign({
    data: {
        plot_id: null,
        showScodeimg: false,
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        wx_image: '',
        toView: '',
        default_img: '',
    },
    goPage: function (e) {
        app.goPage(e.currentTarget.dataset.url, util.query2Params(e.currentTarget.dataset.param), false)
    },
    /**
     * 锚点跳转
     */
    goHash (e) {
        let self = this;
        let hash = e.currentTarget.dataset.hash;
        self.setData({toView: hash});
    },
    /**
     * 电话咨询
     */
    phoneContact: function (e) {
        let phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
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

    onLoad: function (options) {
        wx.showLoading({title: '加载中',})
        var self = this;
        app.getSiteConfig().then(siteConfig => {
            self.setData({
                wx_image: siteConfig.wx_image,
                default_img: siteConfig.m_default_esfimg,
                site_phone: siteConfig.site_phone
            })
        });
        let plot_id = options.id;
        self.setData({plot_id: plot_id});
        /**
         * 新房详细页接口
         */
        api.getMplotDetail(plot_id).then(res => {
            let data = res.data.data;
            if (res.data.status === 'success') {
                self.setData({plotdetail: data});
                // wx.setNavigationBarTitle({title: data.title});//设置导航条标题
                /**
                 *初始化轮播图
                 */
                self.initDetailCover(data.images);
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
                wx.hideLoading();
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
    onShareAppMessage: function (res) {
        let self = this;
        return {
            title: `${self.data.plotdetail.title}`,
            path: `/pages/house_detail/new_house_detail?id=${self.data.plot_id}`
        }
    },
    /**
     * 查看大图
     * @param {String} cur 当前展示图片
     * @param {Array}  imageList 展示的图片列表
     */
    seeHx (e) {
        wx.previewImage({urls: [e.currentTarget.dataset.current]});
    },

}, detailCover));
