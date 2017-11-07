import detailCover from '../../detail/detail-cover/detail-cover';
import detailMap from '../../detail/detail-map/detail-map';
import detailDetailContent from '../../detail/detail-content/detail-content';
// import detailPeriods from '../../detail/detail-periods/detail-periods';
// import detailAreaJunjia from '../../detail/detail-areajunjia/detail-areajunjia';
import detailPlotRecommend from '../../detail/detail-plot-recommend/detail-plot-recommend';
var app = getApp();
var api = require('../../common/api');
var util = require('../../utils/util');
Page(Object.assign({
    data: {
        plot_id: null,
        showHongbao: false,
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
    goPage:function (e) {
         app.goPage(e.currentTarget.dataset.url,util.query2Params(e.currentTarget.dataset.param), false)
    },
    /**
     * 锚点跳转
     */
    goHash (e) {
        let that  = this;
        let hash = e.currentTarget.dataset.hash;
        that.setData({toView: hash});
    },
    /**
     * 红包
     */
    showHongbao: function () {
        let that = this;
        that.setData({
            showHongbao: !that.data.showHongbao
        })
    },
    /**
     * 特惠员报名截止事件
     */
    updateTime: function (endtime) {
        let that = this;
        var timeStamp = Date.parse(new Date()) * 0.001;
        var timestamp2 = Date.parse(new Date(endtime));
        timestamp2 = timestamp2 / 1000;
        var t = timestamp2 - timeStamp;
        var d = Math.floor(t / 60 / 60 / 24);
        var h = Math.floor(t / 60 / 60 % 24);
        var m = Math.floor(t / 60 % 60);
        that.setData({
            tuanendtime: d + " 天 " + h + " 小时 " + m + " 分后结束",
        });
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
     * 二手房列表
     * @param params
     */
    getErshouList: function (params) {
        let that = this;
        api.getEsfList(params).then(res => {
            let data = res.data.data;
            that.setData({
                esf_list: data.list
            });
        });
    },
    /**
     * 报名
     */
    BaoMing: function (e) {
        let plotid = e.currentTarget.dataset.plotid;
        let type = e.currentTarget.dataset.type;
        let plotname = e.currentTarget.dataset.plotname;
        let rid = e.currentTarget.dataset.rid;
        app.goPage('new_house_bm',util.query2Params(`type=${type}&plot_name=${plotname}&rid=${rid}&plotid=${plotid}`), false)
    },
    // /**
    //  *微信咨询
    //  */
    // weichat: function (e) {
    //     let that = this;
    //     that.setData({
    //         showScodeimg: !that.data.showScodeimg
    //     })
    // },
    // Scodeimg: function () {
    //     let that = this;
    //     that.setData({
    //         showScodeimg: !that.data.showScodeimg
    //     })
    // },
    Hongbao: function () {
        let that = this;
        that.setData({
            showHongbao: !that.data.showHongbao
        })
    },
    //查看二维码
    showScode:function(e){
        wx.previewImage({ urls: [e.currentTarget.dataset.current] })
    },
    onLoad: function (options) {
        wx.showLoading({title: '加载中',})
        var that = this;
        app.getSiteConfig().then(siteConfig => {that.setData({
            wx_image: siteConfig.wx_image,
            default_img: siteConfig.m_default_esfimg,
            site_phone: siteConfig.site_phone
        })});
        let plot_id = options.id;
        that.setData({plot_id: plot_id});
        /**
         * 均价走势
         */
        // that.initDetailAreaJunjia('plot',plot_id);
        /**
         * 新房详细页接口
         */
        api.getMplotDetail(plot_id).then(res => {
            let data = res.data.data;
            console.log(data);
            if(res.data.status === 'success'){
                // data.special.price_new = parseInt(data.special.price_new);//特价房
                // data.special.price_old = parseInt(data.special.price_old);//特价房
                // data.house_types.forEach(item => {
                //     item.demo.size = parseInt(item.demo.size);
                //     item.demo.price = parseInt(item.demo.price);
                // })//主力户型
                that.setData({plotdetail: data,});
                // /*
                //  * 初始化楼栋信息
                //  */
                // that.initDetailPeriods(data.periods.reverse());
                /**
                 * 房屋描述
                 */
                // that.initDetailContent(data.price_desc.trim(),1);
                // wx.setNavigationBarTitle({title: data.title});//设置导航条标题
                // /**
                //  *初始化轮播图
                //  */
                // that.initDetailCover(that.data.plot_id, 3, data.iamges);
                // /**
                //  * 初始化特惠员报名截止事件
                //  */
                // that.updateTime(data.tuan.end_time);
                // setInterval(function () {
                //     that.updateTime(data.tuan.end_time);
                // }, 1000);
                // that.setData({kanexpire: util.formatTime2(data.kan.expire, 'Y-M-D'),});
                // /*
                //  * 初始化map
                //  */
                // that.initDetailMap(data.lat, data.lng,data.title,data.address);
                // /*
                //  * 二手房列表
                //  */
                // let params = {category: 1, limit: 3, hid: that.data.plot_id}
                // that.getErshouList(params);
                // /**
                //  * 楼盘推荐
                //  */
                // that.initDetailPlotRecommend(data.relPlots);
                wx.hideLoading();
            }else{
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 1000,
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta:1
                    })
                }, 1000);
            }

        });
    },
    onShareAppMessage: function (res) {
        let that = this;
        return {
            title: `${that.data.plotdetail.title}`,
            path: `/pages/house_detail/new_house_detail?id=${that.data.plot_id}`
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

}, detailCover, detailDetailContent,detailMap, detailPlotRecommend));
