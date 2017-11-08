var api = require('./../../common/api');
const DetailCover = {
    /**
     * 初始化轮播图
     */
    initDetailCover(data) {
        let that = this;
        that.setData({
            coverswiper: {
                imgUrls: data,
                swiper_data_num: data.length,
                swiperCurrent: 0
            }
        });
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
    viewPic (e) {
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
    }
};

export default DetailCover;