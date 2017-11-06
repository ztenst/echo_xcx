import Util from '../../utils/util'
let app = getApp();

Page({
  data: {
    siteConfig: {},

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

    app.getSiteConfig().then(s => { self.setData({ siteConfig: s }) });
    this.setData(Util.decodeKeys(query))

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

    let page = getCurrentPages()[getCurrentPages().length - 1];
    let url = page.route
  },

  openqrd() {
    wx.previewImage({ urls: [this.data.siteConfig.m_dimension] })
  },
  onShareAppMessage(res) {
    return {
      title: `${this.data.siteConfig.city_name || ''}查房价 看看您家房子值多少钱`
    }
  }
})