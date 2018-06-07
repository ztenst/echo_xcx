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
        area_text: '',//当前筛选的区域,
        companyname: '',
        isCompany:false,
        is_true: false,
        userInfo: ''
    },

    onLoad(query) {
        let self = this;
        let _q = Object.assign({}, Util.decodeKeys(query));

        if (_q.companyname) {
            self.setData({
                companyname: _q.companyname,
                isCompany:true
            });
        }
        self.setData({
            userInfo: app.globalData.userInfo
        });
        // app.getUserOpenId().then(res => {
        //     self.setData({
        //         userInfo: app.globalData.userInfo
        //     });
        //     if (res.open_id) {
        //         //如果该用户有open_id,则需要获取手机号老验证身份，否则直接设置用户信息
        //         $dialog.alert({
        //             title: '经纪圈新房通',
        //             content: '经纪圈新房通需要获取您的手机号来验证身份，请点击下方按钮进行确认。',
        //             buttons: [{
        //                 text: '知道了',
        //                 type: 'weui-dialog__btn_primary',
        //             }],
        //             onConfirm(e) {
        //             },
        //         })
        //     }
        // });

        self.searchFilterInit(_q, false, false);
        self.houseSearchListInit();
    },
    /**
     * 前往个人中心
     */
    toMy() {
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
                if (filters.companyname) {
                    self.setData({
                        companyname: filters.companyname
                    });
                }
                let params = self.getSearchParams({company: filters.company});
                self.restartSearch(params);
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
     * 筛选公司
     * @param e
     */
    filterCompany() {
        let self = this;
        self.setData({
            companyname: ''
        });
        if (this.data.isCompany){
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }else{
          let params = self.getSearchParams({company: ''});
          self.restartSearch(params);
        }
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
    getSearchParams(companyObj) {
        let params = Object.assign({}, this.data.filters, companyObj, {
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

        let params = Object.assign({}, this.data.filters, { page: this.data.page, showPay: state.is_true?1:0});

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
    /**
     * 首页转发分享
     * @param res
     * @returns {{title: string, path: string}}
     */
    onShareAppMessage(res) {
        let self= this;
        let params = Object.assign({}, this.data.filters,{companyname:self.data.companyname});
        return {
            title: '全国新房分销大数据平台',
            path: `pages/index/index?${Util.params2Query(params)}`
        }
    },
    onShow:function(){
      this.setData({ is_true: app.globalData.isTrue });
      console.log(this.data.is_true)
    }
});