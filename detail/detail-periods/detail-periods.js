var api = require('./../../common/api');
const DetailPeriods = {
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {
        var that = this;
        that.setData({
            currentTab: parseInt(e.detail.current)
        });
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        var that = this;
        that.setData({
            currentTab: e.currentTarget.dataset.current
        });
    },
    imageLoad:function (event) {
        let  that = this;
        that.setData({
            currentImageW: event.detail.width + "px",
            currentImageH: event.detail.height + "px"
        });
    },
    //初始化
    initDetailPeriods(periods) {
        let that = this;
        that.setData({
            // tab切换
            currentTab: 0,
            periods: periods
        });
    },
};

export default DetailPeriods;