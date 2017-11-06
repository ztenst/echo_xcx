import {
  $searchBar,
  $houseSearchList,
} from "../../components/wxcomponents"
import config from '../../config'
import api from '../../common/api'

let app = getApp();

Page({
  data: {
    ready: false,
    title: '',
    logo: '',
    banner: '',
    m_default_plotimg: '',
    m_default_esfimg: '',

    new_plot: [],
    esf_plot: [],
    static_path: config.static_path
  },
  onLoad() {

    let self = this;
    //搜索栏
    $searchBar.init({
      onFocus() {
        wx.setNavigationBarTitle({
          title: '搜索'
        })
      },
      onBlur() {
        wx.setNavigationBarTitle({
          title: self.data.title
        })
      },
      onSelectTip(tip) {
        if (tip.type == 1) {
          wx.navigateTo({
            url: `/pages/house_detail/new_house_detail?id=${tip.id}`
          });
        } else {
          let title = `${tip.name}(${['新房', '二手房', '租房'][tip.type - 1]})`;
          wx.navigateTo({
            url: `/pages/house_search/house_search?title=${title}&type=${tip.type}&hid=${tip.id}`
          });
        }
      },
      onSelectHot(obj) {
        wx.navigateTo({
          url: `/pages/house_detail/new_house_detail?id=${obj.id}`
        });
      },
      onSelectStore(keyword) {
        wx.navigateTo({
          url: `/pages/house_search/house_search?keyword=${keyword}&type=1`
        });
      },
      onConfirm(keyword) {
        wx.navigateTo({
          url: `/pages/house_search/house_search?keyword=${keyword}&type=1`
        });
      }
    });

    $houseSearchList.init();
    //首页推荐
    api.getIndexInfo().then(resp => {
      let json = resp.data;

      json.data.newPlot.forEach(item => {
        item.lat = item.map_lat;
        item.lng = item.map_lng;
        item.discount_des = item.discount_des || item.red;
        item.ts = item.xmts;
      })

      self.setData({
        ready: true,
        logo: json.data.top.logo,
        banner: json.data.top.image,
        new_plot: json.data.newPlot.splice(0, 6),
        esf_plot: json.data.esfPlot.splice(0, 6),
      })

    })

  },
  onShow() {
    let self = this;
    app.getSiteConfig(true).then(siteConfig => {
      let title = siteConfig.site_name + '房产';
      wx.setNavigationBarTitle({
        title: title
      })
      self.setData({
        title,
        m_default_plotimg: siteConfig.m_default_plotimg,
        m_default_esfimg: siteConfig.m_default_esfimg,
        site_phone: siteConfig.site_phone,
        site_name: siteConfig.site_name
      })
    })
  },
  call(e) {
    let phone = e.currentTarget.dataset.phone.replace(/\s*转\s*/, ',');
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.title
    }
  }
})