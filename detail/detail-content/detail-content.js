var WxParse = require('../../libs/wxParse/wxParse.js');
const DetailContent = {
    //初始化
    initDetailContent(data,contentype) {
        let that = this;
        /**
         * html解析示例
         */
        WxParse.wxParse('detailContent', 'html', data, that);
        that.setData({
            contentype:contentype
        });
        if(data){
            that.showDetailContent();
        }
    },
    zsTap: function (e) {
        let that = this;
        that.setData({
            isShowExtend: !that.data.isShowExtend
        });
    },
    showDetailContent: function () {
        let that = this;
        setTimeout(function () {
            wx.createSelectorQuery().select('#detailContent').fields({
                size: true,
            }, function (res) {
                if (res.height > 150) {
                    that.setData({
                        isShowExtend: true,
                        canExtend: true
                    });
                } else {
                    that.setData({
                        isShowExtend: false,
                        canExtend: false
                    });
                }
            }).exec();
        }, 200)
    }

};
export default DetailContent;