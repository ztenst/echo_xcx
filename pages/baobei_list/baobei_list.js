import {
    $searchBar} from '../../components/wxcomponents'
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
        title: '',
        area_fixed: false,
        key: '',
        uid:''
    },

    onLoad(query) {
        let self = this;

        self.setData({
            uid:2064
        })
        /**
         * 搜索组件初始化
         */
        $searchBar.init({
            placeholder_text:'请输入客户姓名/手机号',
            onInputkw(keyword) {
                self.restartSearch({kw:keyword});
            },
            onSearch(keyword){
                self.restartSearch({kw:keyword});
            }
        });
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
     * 搜索报备列表
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

        let params = Object.assign({uid:state.uid},{page: this.data.page});

        api.getUserList(params).then(resp => {
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

    }
});