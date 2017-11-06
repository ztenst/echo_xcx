import detailCover from '../../detail/detail-cover/detail-cover';
import detailMap from '../../detail/detail-map/detail-map';
import detailDetailZfInterest from '../../detail/detail-zf-interest/detail-zf-interest';
import detailDetailContact from '../../detail/detail-contact/detail-contact';
import detailDetailContent from '../../detail/detail-content/detail-content';
import detailDetailTag from '../../detail/detail-tag/detail-tag';

var api = require('../../common/api');
var app = getApp();
var util = require('../../utils/util');
Page(Object.assign({
    data: {
        rent_id:null,
        rentdetail: {}
    },
    goPage:function (e) {
        app.goPage(e.currentTarget.dataset.url,util.query2Params(e.currentTarget.dataset.param), false)
    },
    onLoad: function (options) {
        wx.showLoading({title: '加载中',})
        var that = this;
        that.initDetailTag('zfzzpt');
        that.setData({
            rent_id:options.id
        })
        /**
         *初始化二手房详细页轮播图
         */
        that.initDetailCover(options.id,2);
        api.getZfInfo(options.id).then(res => {
            let data = res.data.data;
            if(res.data.status === 'success'){
                that.setData({rentdetail: data,});
                /**
                 * 设置导航条标题
                 */
                wx.setNavigationBarTitle({title: data.plot_name});
                that.initDetailMap(data.map_lat, data.map_lng,data.plot_name,data.address);
                that.initDetailContent(data.content.trim(),1);
                that.initDetailContact(data);
                let params = {bedroom:data.bedroom, category:1, infoid:options.id, limit:6, street:data.sstreet, type:options.id}
                that.initDetailZfInterest(params);
                api.getPlotInfo(data.hid).then(ress =>{
                    let data = ress.data.data;
                    that.setData({
                        xfdetail: data,
                    });
                    wx.hideToast();
                })
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
            title: `${that.data.rentdetail.title}${that.data.rentdetail.bedroom}室${that.data.rentdetail.livingroom}厅${that.data.rentdetail.size}㎡${parseInt(that.data.rentdetail.price)}元`,
            path: `/pages/house_detail/rent_house_detail?id=${that.data.rent_id}`
        }
    },
}, detailCover, detailMap,detailDetailZfInterest, detailDetailContact,detailDetailContent,detailDetailTag));
