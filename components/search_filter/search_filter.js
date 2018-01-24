import Component from '../component'
import api from '../../common/api'
import Util from '../../utils/util'

const SCOPE = '$searchFilter';
let timeout = null;

//取得筛选字段
function getFilterKeys() {
    return ['toptag', 'street', 'aveprice', 'sfprice', 'company', 'kw'];
}

//取得其他筛选字段
function getOtherKeys() {
    return ['sort', 'wylx', 'zxzt'];
}

export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            /**
             * 搜索相关的初始化数据
             */
            kw: '',
            kw_input: '', //分开有的手机输入时会有重字问题
            focused: false,

            /*搜索框获得焦点*/
            onFocus() {
            },
            /*搜索框输入*/
            onInputkw() {
            },
            /*确认搜索*/
            onConfirm() {
            },
            /*清除搜索框*/
            onClearkw() {
            },
            /*搜索框失去焦点*/
            onBlur() {
            },


            /**
             * 筛选相关的初始化数据
             */
            isFinishInit: false,
            area_fixed: false, //没有小区筛选项
            tab: '',

            area_index: 0, //area_index区域数组的index, 非筛选字段
            toptag_filters: [],
            company_filters: {
                name: ""
            },
            area_filters: [],
            aveprice_filters: [],
            sfprice_filters: [],
            other_filters: [],
            titles: {
                area: '',
                street: '',
                aveprice: '',
                sfprice: '',
                company: '',
                other: ''
            },

            filters: {},

            onFilter() {
            } //搜索回调方法


        }
    },

    assign(opts) {
        let options = Object.assign({}, this.setDefaults(), opts);
        options.area_fixed = false;
        let keys = getFilterKeys();
        let fs = {};
        keys.forEach(key => fs[key] = opts.filters[key] || '')
        options.filters = fs;
        return options;

    },
    init(opts = {}) {
        const options = this.assign(opts);
        const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {
                /**
                 * 搜索相关
                 */
                //搜索得到焦点
                focus() {
                    this.setData({
                        [`${SCOPE}.focused`]: true
                    });
                    typeof options.onFocus === 'function' && options.onFocus()
                },
                //搜索输入关键字
                inputkw(e) {
                    let self = this;
                    let kw = e.detail.value;
                    this.setData({
                        [`${SCOPE}.filters.kw`]: e.detail.value
                    });
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(() => self.triggerFilter(), 300);

                    typeof options.onInputkw === 'function' && options.onInputkw(kw, this);

                },
                //清除关键字
                clearkw(e) {
                    this.setData({
                        [`${SCOPE}.filters.kw`]: '',
                        [`${SCOPE}.filters.kw_input`]: '',
                        [`${SCOPE}.kw`]: '',
                        [`${SCOPE}.kw_input`]: '',
                    });
                    this.triggerFilter();
                    typeof options.onClearkw === 'function' && options.onClearkw()
                },
                //取消搜索
                cancel() {
                    this.setData({
                        [`${SCOPE}.focused`]: false
                    });
                    if(this.getComponentData().filters.kw){
                        this.clearkw()
                    }
                },
                //确认
                confirm(e) {
                    this.cancel();
                    let kw = e.detail.value;
                    // typeof options.onConfirm === 'function' && options.onConfirm(kw);
                },


                /**
                 * 筛选相关
                 * @param e
                 */
                setTab(e) {
                    let index = e.currentTarget.dataset.index;

                    let _index = this.getComponentData().tab;

                    this.setData({
                        [`${SCOPE}.tab`]: index == _index ? '' : index
                    });
                },

                requestOptions() {
                    let self = this;
                    let data = self.getComponentData();
                    let ajaxs = [];
                    //获取搜索顶部的tags数据
                    ajaxs.push(api.getTagsIndex("wzlm").then(resp => {
                        let json = resp.data.data;
                        self.setData({
                            [`${SCOPE}.toptag_filters`]: [{
                                id: '',
                                name: '全部'
                            }].concat(json),
                        })
                    }));
                    //获取筛选tags的数据
                    let empty = {
                        id: '',
                        name: '不限'
                    };
                    ajaxs.push(api.getFilterTags("plotFilter").then(resp => {
                        let json = resp.data.data;
                        let quyu = json[0].list;
                        let junjia = json[1].list;
                        let shoufu = json[2].list;
                        let qita = json[3].list;
                        self.setData({
                            [`${SCOPE}.aveprice_filters`]: [empty].concat(junjia),
                            [`${SCOPE}.sfprice_filters`]: [empty].concat(shoufu)
                        });

                        let areas = [Object.assign(empty, {childAreas: []})].concat(quyu);
                        areas = areas.map(function(v,k) {
                            if (k) {
                                v.childAreas.unshift({id: '0', name: '不限'});
                            }
                            return v;
                        });
                        self.setData({
                            [`${SCOPE}.area_filters`]: areas
                        })
                        if (data.filters.area) {
                            let i = areas.findIndex(item => item.id == data.filters.area)
                            if (i > -1) {
                                self.setData({
                                    [`${SCOPE}.area_index`]: i
                                })
                            }
                        }

                        let _list = [];
                        for (let i in qita) {
                            if (qita[i].list.length > 0) {
                                _list.push({
                                    key: qita[i].filed,
                                    title: qita[i].name,
                                    array: [empty].concat(qita[i].list)
                                })
                            }
                        }

                        self.setData({
                            [`${SCOPE}.other_filters`]: _list
                        })

                    }));
                    Promise.all(ajaxs).then(vals => {
                        self.triggerFilter();
                    })
                },

                /*各个设置筛选*/
                setArea(e) {
                    this.setFilter(e, {
                        [`${SCOPE}.area_index`]: e.target.dataset.areaindex,
                        [`${SCOPE}.filters.street`]: '0'
                    });
                    if (e.target.dataset.areaindex == 0) {
                        this.triggerFilter();
                    }
                },
                //选中后立即搜索
                filterNow(e) {
                    this.setFilter(e)
                    this.triggerFilter();
                },

                //其他筛选确定
                setOther(e) {
                    this.triggerFilter();
                },

                /*设置筛选条件基础方法*/
                setFilter(e, otherParams = {}) {
                    let key = e.currentTarget.dataset.key;
                    let value = e.currentTarget.dataset.id;
                    let params = Object.assign({
                        [`${SCOPE}.filters.${key}`]: value
                    }, otherParams);
                    this.setData(params);
                },

                /*重置其他*/
                resetOthers() {
                    let data = this.getComponentData();
                    let obj = {};
                    let keys = getOtherKeys();
                    keys.forEach(key => obj[key] = '')

                    let f = Object.assign(data.filters, obj)

                    this.setData({
                        [`${SCOPE}.filters`]: f
                    })
                },

                //更新标题
                updateTitles() {
                    let data = this.getComponentData();
                    let filters = data.filters;
                    let titles = data.titles;
                    //初始化
                    Object.keys(titles).forEach(i => titles[i] = '')
                    //区域
                    if (filters.area && data.area_filters.length > 0) {
                        let area = data.area_filters[data.area_index];
                        titles.area = area.name;
                    }

                    //均价
                    if (filters.aveprice && data.aveprice_filters.length > 0) {
                        let s = data.aveprice_filters.find(item => filters.aveprice == item.id);
                        if (s) titles.aveprice = s.name;
                    }
                    //首付
                    if (filters.sfprice && data.sfprice_filters.length > 0) {
                        let s = data.sfprice_filters.find(item => filters.sfprice == item.id);
                        if (s) titles.sfprice = s.name;
                    }

                    if (data.other_filters.length > 0) {
                        let i = 0;
                        getOtherKeys().forEach(key => {
                            if (filters[key]) i++;
                        })
                        titles.other = i;
                    }

                    this.setData({
                        [`${SCOPE}.titles`]: titles
                    })
                },

                /*筛选最终触发事件*/
                triggerFilter() {
                    this.setData({
                        [`${SCOPE}.tab`]: ''
                    });

                    this.updateTitles();
                    let data = this.getComponentData();

                    let filters = Object.assign({}, data.filters);
                    if (filters.street == 0) filters.street = '';


                    let params = Util.filterEmpty(filters);

                    // console.log(params);
                    // console.log(Util.params2Query(params));

                    typeof options.onFilter === 'function' && options.onFilter(params, data.titles);
                }

            }
        });
        component.requestOptions();
        return component;
    }
}