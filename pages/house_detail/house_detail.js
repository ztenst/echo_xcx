import {
    $detailContent, $actionSheet
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
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
    onLoad: function (options) {
        wx.showLoading({title: '加载中',})
        var self = this;
        let plot_id = options.id;
        self.setData({plot_id: plot_id});
        /**
         * 新房详细页接口
         */
        api.getMplotDetail(plot_id).then(res => {
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

    goPage: function (e) {
        app.goPage(e.currentTarget.dataset.url, Util.query2Params(e.currentTarget.dataset.param), false)
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
    tapCall() {
        let self = this;
        $actionSheet.show('phone',{
            titleText: '电话',
            list: self.data.plotdetail.phones,
            buttonClicked(index, item) {
                return true
            },
            cancel() {},
        })
    },
    tapFenXiao() {
        let self = this;
        $actionSheet.show('fenxiao',{
            titleText: '分销',
            hid:self.data.plotdetail.id,
            list: self.data.plotdetail.phones,
            buttonClicked(index, item) {
                return true
            },
            cancel() {},
        })

    },
});
