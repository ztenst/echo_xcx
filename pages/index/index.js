import {
    $searchFilter,
    $houseSearchList,
} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

Page({
    data: {
        kw: '',
        page: 0,
        max_page: 0,
        requested: false, // 判断是否请求过数据, 每次重新搜索会重置
        loading: false,
        filters: {},
        list: [],
        total:0,
        default_img: '',
        title: '', //某房产列表的title
        area_fixed: false,
        key:'',
        area_text: '' //当前筛选的区域
    },

    onLoad(query) {
        let self = this;
        let TITLE = "经济圈新房通";
        let area_fixed = false;

        let _q = Object.assign({}, Util.decodeKeys(query));

        this.setData({
            title: TITLE,
            area_fixed: area_fixed
        });

        wx.setNavigationBarTitle({
            title:TITLE,
        });

        self.searchFilterInit(_q,area_fixed,false);
        self.houseSearchListInit();

        // wx.login({
        //     success: function (res) {
        //         if (res.code) {
        //             //发起网络请求
        //             let params = {
        //                 code: res.code,
        //             }
        //             api.getOpenId(params).then(resp => {
        //                 let json = resp.data;
        //                 console.log(json)
        //                 self.setData({
        //                     key:json.trim()
        //                 })
        //             })
        //
        //         } else {
        //             console.log('获取用户登录态失败！' + res.errMsg)
        //         }
        //     }
        // });
        //

    },
    getPhoneNumber: function(e) {
        let that =this;
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未授权',
                success: function (res) { }
            })
        } else {
            app.getUserOpenId().then(accessKey => {
                let params = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    accessKey:accessKey
                }
                api.getDecode(params).then(resp => {
                    let json = resp.data;
                    console.log(json)
                })
            })
        }
    },
    //列表组件初始化
    houseSearchListInit(){
        let self = this;
        $houseSearchList.init({
            onFilter(filters) {
                let data = self.getSearchParams();
                let params = Object.assign({}, data, filters);
                self.searchFilterInit(params,false,true);
            }
        });
    },
    //筛选组件初始化
    searchFilterInit(_q,area_fixed,isFinishInit){
        let self = this;
        //筛选组件初始化
        $searchFilter.init({
            area_fixed: area_fixed,
            filters: _q, //传入筛选条件
            isFinishInit:isFinishInit,
            onFilter(filters, titles) {
                self.setData({
                    area_text: false
                })
                self.restartSearch(filters);
            }
        })
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
            page: this.data.page,
        });
        return params
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

        let params =  Object.assign({},  this.data.filters,{page:this.data.page});

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
                    total:json.data.num
                });
            } else if (!state.area_fixed) {
                self.setData({
                    requested: true,
                    loading: false
                })
            }
        })

    },


});