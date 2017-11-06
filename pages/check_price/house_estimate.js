import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();
let siteConfig = {};

Page({
  data: {
    nickName: '',
    avatarUrl: '',

    plot: '',
    face: '',
    floor: '',
    total_floor: '',
    total_price: '',
    est_price: 0,
    rate: 0
  },
  onLoad(query) {
    let self = this;

    query.rate = parseInt(query.rate)
    this.setData(Util.decodeKeys(query))

    app.getSiteConfig().then(s => siteConfig = s);

    //用户信息
    if (!query.nickName || !query.avatarUrl) {
      app.getUserInfo().then(userInfo => {
        self.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        });
      });
    } else {
      self.setData({
        nickName: query.nickName,
        avatarUrl: query.avatarUrl
      });
    }

    wx.showShareMenu();
  },
  poster() {
    let params = Object.assign({}, this.data);
    wx.redirectTo({
      url: `./poster_canvas/canvas?${Util.params2Query(params)}`
    });
  },
  back() {
    wx.navigateTo({
      url: `./check_price?position=bottom`
    });
  },

  onShareAppMessage(res) {
    let params = Object.assign({}, this.data);
    delete params.__webviewId__;
    console.log(Util.params2Query(params));
    return {
      title: `${siteConfig.city_name || ''}查房价 看看您家房子值多少钱`,
      path: `/pages/check_price/house_estimate?${Util.params2Query(params)}`
    }
  }

})