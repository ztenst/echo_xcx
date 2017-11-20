import {
    $searchBar,
    $houseSearchList} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {
        kw: '',
        page: 0,
        max_page: 0,
        scrollTop: 100,
        requested: false, // 判断是否请求过数据, 每次重新搜索会重置
        loading: false,
        filters: {},
        list: [],
        total: 0,
        default_img: '',
        title: '', //某房产列表的title
        area_fixed: false,
        key: '',
        area_text: '' //当前筛选的区域,
    },

    onLoad() {
        let self = this;
        let TITLE = "我的收藏";
        let _q = Object.assign({},{'save':1});
        wx.setNavigationBarTitle({
            title: TITLE,
        });
        /**
         * 搜索组件初始化
         */
        $searchBar.init({
            filters: _q, //传入筛选条件
            onFilter(filters, titles) {
                self.restartSearch(filters);
            }
        });

        /**
         * 列表组件初始化
         */
        $houseSearchList.init();
    },

    /**
     * 重置搜索
     * @param filters
     */
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

    /**
     * 获得搜索参数
     * @returns {*}
     */
    getSearchParams() {
        let params = Object.assign({}, this.data.filters, {
            page: this.data.page,
        });
        return params
    },

    /**
     * 搜索房产
     */
    requestList() {
        let self = this;
        let state = self.data;
        if (state.loading) return;
        if (state.requested && state.page >= state.max_page) return;

        self.setData({
            loading: true,
            page: state.page + 1
        });

        let params = Object.assign({}, this.data.filters, {page: this.data.page});

        api.getXfList(params).then(resp => {
            let json = resp.data;
            let list = json.data.list;

            if (json.data.page_count > 0 && list.length > 0) {
                //requested 和loading要和数据一起设置, 否则会有极短时间显示出"无数据"
                self.setData({
                    requested: true,
                    loading: false,
                    max_page: json.data.page_count,
                    list: state.list.concat(list),
                    total: json.data.num
                });
            } else if (!state.area_fixed) {
                self.setData({
                    requested: true,
                    loading: false
                })
            }
        })

    },

    /**
     * 取消收藏
     */
    cancelCollect(e){
        let dataset=e.currentTarget.dataset;
    }
});