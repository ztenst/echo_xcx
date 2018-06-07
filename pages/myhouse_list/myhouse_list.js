import {
    $toast,
    $searchBar
} from '../../components/wxcomponents'
import api from '../../common/api'


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
        uid: ''
    },

    onLoad(query) {
        let self = this;

        self.setData({
            uid: app.globalData.userInfo.id
        })
        /**
         * 搜索组件初始化
         */
        $searchBar.init({
            placeholder_text: '请输入项目名称',
            onInputkw(keyword) {
                self.restartSearch({kw: keyword});
            },
            onSearch(keyword) {
                self.restartSearch({kw: keyword});
            }
        });

        /**
         * 列表组件初始化
         */
        self.requestList();
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
     * 取消收藏
     */
    cancelCollect(e) {
        let self = this,isTrue = app.globalData.isTrue, dataset = e.currentTarget.dataset;

        let params = {
            hid: dataset.id,
            uid: app.globalData.userInfo.id
        };

        if (!isTrue) {
            app.goPage('/pages/add_message/add_message', null, false);
        } else {
            api.addCollection(params).then(function (res) {
                let data = res.data;
                $toast.show({
                    timer: 2e3,
                    text: data.msg,
                    success: () => console.log('文本提示')
                });
                if (data.status == 'success') {
                    self.restartSearch({kw: self.data.filters.kw});
                }
            });
        }

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

        let params = Object.assign({'uid': state.uid,'showPay':1}, this.data.filters, {page: this.data.page});

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
     * 跳转详细页
     */
    navigateDetail(e){
        let dataset = e.currentTarget.dataset;
        let url = '/pages/house_detail/house_detail';
        app.goPage(url, {id:dataset.id}, false);
    },
    goFabuHouse(){
        api.checkCanSub({phone:app.globalData.userInfo.phone}).then(res=>{
            let json =res.data;
            if(json.status=="success"){
                let url = '/pages/house_fabu/house_fabu';
                app.goPage(url, {uid: 1}, false);
            }else{
                $toast.show({
                    timer: 2e3,
                    text: json.msg,
                });
            }
        });
    }
});