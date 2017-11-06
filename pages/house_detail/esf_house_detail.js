import detailCover from '../../detail/detail-cover/detail-cover';
import detailMap from '../../detail/detail-map/detail-map';
// import detailAreaJunjia from '../../detail/detail-areajunjia/detail-areajunjia';
import detailEsfLoan from '../../detail/detail-esfloan/detail-esfloan';
import detailSellInterest from '../../detail/detail-sell-interest/detail-sell-interest';
import detailDetailContact from '../../detail/detail-contact/detail-contact';
import detailDetailTag from '../../detail/detail-tag/detail-tag';
import detailDetailContent from '../../detail/detail-content/detail-content';
var api = require('../../common/api');
var app = getApp();
var util = require('../../utils/util');
Page(Object.assign({
    data: {
        esf_id: null,
        esfdetail: {}
    },
    goPage:function (e) {
        app.goPage(e.currentTarget.dataset.url,util.query2Params(e.currentTarget.dataset.param), false)
    },
    onLoad: function (options) {
        wx.showLoading({title: '加载中',})
        var that = this;
        that.setData({esf_id: options.id});
        /**
         *初始化二手房详细页轮播图
         */
        that.initDetailCover(options.id, 1);
        that.initDetailTag('esfzzpt');
        /**
         * 二手房详细页接口
         */
        api.getEsfInfo(options.id).then(res => {
            let data = res.data.data;
            if(res.data.status === 'success') {
                data.ave_price = parseInt(data.ave_price);//均价
                data.price = parseInt(data.price);//售价
                that.setData({esfdetail: data,});
                /**
                 * 设置导航条标题
                 */
                wx.setNavigationBarTitle({title: data.plot_name});
                /**
                 * 均价走势
                 */
                // that.initDetailAreaJunjia('esf', data.hid);
                /**
                 * 房屋描述
                 */
                that.initDetailContent(data.content.trim(),2);
                /**
                 * 饼图显示房价
                 */
                that.initDetailEsfLoan(data.price);
                /**
                 * 初始化静态地图
                 */
                that.initDetailMap(data.map_lat, data.map_lng, data.plot_name,data.address);
                let params = {bedroom: data.bedroom, category: 1, infoid: options.id, limit: 6, street: data.sstreet}
                that.initDetailSellInterest(params, data.price);
                that.initDetailContact(data);
                api.getPlotInfo(data.hid).then(ress => {
                    let data = ress.data.data;
                    that.setData({xfdetail: data,});
                });
                setTimeout(function () {
                    wx.hideLoading();
                }, 300)
            }else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 1000,
                });
                setTimeout(() => {
                    wx.navigateBack({
                        delta:1
                    });
                }, 1000);
            }
        });
    },
    onShareAppMessage: function (res) {
        let that = this;
        return {
            title: `${that.data.esfdetail.title}${that.data.esfdetail.bedroom}室${that.data.esfdetail.livingroom}厅${that.data.esfdetail.size}㎡${parseInt(that.data.esfdetail.price)}万元`,
            path: `/pages/house_detail/esf_house_detail?id=${that.data.esf_id}`
        }
    },
}, detailCover, detailMap, detailEsfLoan, detailSellInterest, detailDetailContact, detailDetailContent, detailDetailTag));
