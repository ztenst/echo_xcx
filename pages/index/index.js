import {
    $searchFilter,
    $houseSearchList,
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();
let siteConfig = {};
let searchFilter = {};

Page({
    data: {
        kw: '',
        page: 0,
        max_page: 0,
        requested: false, // 判断是否请求过数据, 每次重新搜索会重置
        loading: false,
        filters: {},
        list: [],
        default_img: '',

        title: '', //某小区房产列表的title
        area_fixed: false,

        area_text: '' //当前筛选的区域
    },

    onLoad(query) {
        let self = this;
        let TITLE = "经济圈新房通";
        let area_fixed = false;

        // app.getSiteConfig().then(s => {
        //   siteConfig = s;
        //   self.setData({
        //     default_img: type === 1 ? s.m_default_plotimg : s.m_default_esfimg
        //   })
        // });

        let _q = Object.assign({
            title: TITLE
        }, Util.decodeKeys(query));

        this.setData({
            title: _q.title,
            area_fixed: area_fixed
        });

        wx.setNavigationBarTitle({
            title: _q.title,
        });

        $houseSearchList.init();

        searchFilter = $searchFilter.init({
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
    // getSearchParams() {
    //     let params = Object.assign({}, this.data.filters, {
    //         page: this.data.page,
    //     });
    //
    //     return params;
    // },

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

        let params = this.data.filters;

        api.getXfList(params).then(resp => {
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
            }

        })

    },

    // onShareAppMessage(res) {
    //     let params = Object.assign({}, this.data.filters, {
    //         keyword: this.data.keyword,
    //         hid: this.data.hid,
    //         title: this.data.title
    //     })
    //     let type = this.data.type;
    //     if (Object.keys(this.data.filters).length === 0) {
    //         return {
    //             title: `${siteConfig.city_name}${['买新房', '二手房', '找租房'][type - 1]}`,
    //         }
    //     } else {
    //         return {
    //             title: `${siteConfig.city_name} ${this.data.area_text}${['优质楼盘推荐', '好房推荐', '租房推荐'][type - 1]}`,
    //             path: `pages/house_search/house_search?${Util.params2Query(params)}`
    //         }
    //     }
    //
    // }

});