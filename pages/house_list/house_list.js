import {
  $searchBar,
  $searchFilter,
  $houseSearchList,
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();
let siteConfig = {};
let searchFilter = {};
const APIS = ['getXfList'];

Page({
  data: {
    keyword: '',
    type: 0, // 1新房 2二手房 3租房
    page: 0,
    max_page: 0,
    requested: false, // 判断是否请求过数据, 每次重新搜索会重置
    loading: false,
    filters: {},
    list: [],
    spare_list: [], // 猜你喜欢的列表
    default_img: '',

    hid: '',
    title: '', //某小区房产列表的title
    area_fixed: false,

    area_text: '' //当前筛选的区域
  },

  onLoad(query) {
    let self = this;

    let type = parseInt(query.type) || 1;
    let typeTitle = ['买新房', '二手房', '找租房'][type - 1];
    let _title = ['新房', '二手房', '租房'][type - 1];
    let area_fixed = !!query.hid; //hid表明小区固定

    app.getSiteConfig().then(s => {
      siteConfig = s;
      self.setData({
        default_img: type === 1 ? s.m_default_plotimg : s.m_default_esfimg
      })
    });

    let _q = Object.assign({
      keyword: '',
      hid: '',
      title: typeTitle
    }, Util.decodeKeys(query));

    this.setData({
      type: type,
      keyword: _q.keyword,
      hid: _q.hid,
      title: _q.title,
      area_fixed: area_fixed
    });

    wx.setNavigationBarTitle({
      title: _q.title
    });

    $houseSearchList.init();

    if (!this.data.area_fixed) {
      //搜索栏
      $searchBar.init({
        type: type,
        keyword: _q.keyword,
        onFocus() {
          wx.setNavigationBarTitle({
            title: `${_title}搜索`
          })
        },
        onBlur() {
          wx.setNavigationBarTitle({
            title: _q.title
          })
        },
        onSelectTip(tip) {
          if (type === 1) {
            wx.navigateTo({
              url: `/pages/house_detail/new_house_detail?id=${tip.id}`
            });
          } else {
            let title = `${tip.name}(${_title})`;
            wx.navigateTo({
              url: `/pages/house_search/house_search?title=${title}&type=${tip.type}&hid=${tip.id}`
            });
          }
        },
        onSelectHot(obj) {
          if (type === 1) {
            wx.navigateTo({
              url: `/pages/house_detail/new_house_detail?id=${obj.id}`
            });
          } else {
            let query = obj.extra;
            wx.redirectTo({
              url: `/pages/house_search/house_search?type=${_q.type}&${query}`
            });
          }
        },
        onSelectStore(keyword) {
          self.setData({
            keyword: keyword
          })
          self.restartSearch();
        },
        onConfirm(keyword) {
          self.setData({
            keyword: keyword
          })
          self.restartSearch();
        }
      });
    }

    searchFilter = $searchFilter.init({
      type: type,
      area_fixed: area_fixed,
      filters: _q, //传入筛选条件
      onFilter(filters, titles) {
        self.setData({
          area_text: titles.area
        })
        self.restartSearch(filters);
      }
    });

  },

  onShow(){
    let pages = getCurrentPages();
    console.log(pages);
    console.log(`pages length: ${pages.length}`);
  },
  //重置搜索
  restartSearch(filters) {
    this.setData({
      page: 0,
      max_page: 0,
      requested: false,
      filters: filters,
      list: []
    })
    this.requestList()
  },

  //获得搜索参数
  getSearchParams() {
    let params = Object.assign({}, this.data.filters, {
      // category: 1,
      kw: this.data.keyword,
      hid: this.data.hid,
      page: this.data.page,
    });

    return params;
  },

  //搜索房产
  requestList() {
    let self = this;
    let state = self.data;
    if (state.loading) return;
    if (state.requested && state.page >= state.max_page) return;

    self.setData({
      loading: true,
      page: state.page + 1
    });

    let apiName = APIS[state.type - 1];
    let params = this.getSearchParams();

    api[apiName](params).then(resp => {
      let json = resp.data;
      let list = json.data.list;

      if (json.data.page_count > 0 && list.length > 0) {
        //requested 和loading要和数据一起设置, 否则会有极短时间显示出"无数据"
        self.setData({
          requested: true, 
          loading: false,
          max_page: json.data.page_count,
          list: state.list.concat(list)
        })
      } else if (!state.area_fixed) {
        self.setData({
          requested: true,
          loading: false
        })
        self.requestSpare();
      }

    })

  },

  //请求猜你喜欢, 只请求1次
  requestSpare() {
    let self = this;
    let state = self.data;

    if (state.spare_list.length > 0) return;

    let apiName = APIS[state.type - 1];

    api[apiName]({
      page: 1
    }).then(resp => {
      let json = resp.data;
      let list = json.data.list;

      if (list.length > 0) {

        self.setData({
          spare_list: list
        })
      }
    });
  },

  call(e) {
    let phone = e.currentTarget.dataset.phone.replace(/\s*转\s*/, ',')
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  onShareAppMessage(res) {
    let params = Object.assign({}, this.data.filters, {
      keyword: this.data.keyword,
      hid: this.data.hid,
      title: this.data.title
    })
    let type = this.data.type;
    if (Object.keys(this.data.filters).length === 0) {
      return {
        title: `${siteConfig.city_name}${['买新房','二手房','找租房'][type-1]}`,
      }
    } else {
      return {
        title: `${siteConfig.city_name} ${this.data.area_text}${['优质楼盘推荐','好房推荐','租房推荐'][type-1]}`,
        path: `pages/house_search/house_search?${Util.params2Query(params)}`
      }
    }

  }

});