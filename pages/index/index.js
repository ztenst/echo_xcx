import {
    $searchFilter,
    $houseSearchList,
    $dialog
} from '../../components/wxcomponents'
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

    onLoad(query) {
        let self = this;
        let area_fixed = false;

        app.getUserInfo().then(res=>{
            self.setData({
                "avatarUrl": res.avatarUrl
            });
        })

        let _q = Object.assign({}, Util.decodeKeys(query));

        this.setData({
            area_fixed: area_fixed
        });

        app.getUserOpenId().then(res =>{
            if(res.open_id){
                //对话框组件初始化
                app.globalData.wxData=res;
                $dialog.alert({
                    title: '经纪圈新房通',
                    content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
                    buttons:[{
                        text:'知道了',
                        type: 'weui-dialog__btn_primary',
                    }],
                    onConfirm(e) {

                    },
                })
            }else{
                app.globalData.customInfo = res;
                app.globalData.isUser = true;
            }
        })



        self.searchFilterInit(_q, area_fixed, false);
        self.houseSearchListInit();
    },
    /**
     * 前往个人中心
     */
    toMy () {
        let url = '/pages/my/my';
        app.goPage(url, null, false);
    },
    /**
     * 滚动置顶
     * @param e
     */
    tapMove(e) {
        this.setData({
            scrollTop: this.data.scrollTop
        })
    },
    /**
     * 列表组件初始化
     */
    houseSearchListInit() {
        let self = this;
        $houseSearchList.init({
            onFilter(filters) {
                let data = self.getSearchParams();
                let params = Object.assign({}, data, filters);
                self.searchFilterInit(params, false, true);
            }
        });
    },
    /**
     * 筛选组件初始化
     * @param _q
     * @param area_fixed
     * @param isFinishInit
     */
    searchFilterInit(_q, area_fixed, isFinishInit) {
        let self = this;
        //筛选组件初始化
        $searchFilter.init({
            area_fixed: area_fixed,
            filters: _q, //传入筛选条件
            isFinishInit: isFinishInit,
            onFilter(filters, titles) {
                self.setData({
                    area_text: false
                })
                self.restartSearch(filters);
            }
        })
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
                    loading: false,
                    total: json.data.num
                })
            }
        })

    },

    onShareAppMessage(res) {
        let params = Object.assign({}, this.data.filters);
        console.log(this.data.filters)
        return {
            title: '经济圈新房通',
            path: `pages/index/index?${Util.params2Query(params)}`
        }
    }
});