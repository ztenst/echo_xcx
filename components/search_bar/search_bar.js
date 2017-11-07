import Component from '../component'
import api from '../../common/api'

const SCOPE = '$searchBar';
const STORAGE_KEY = 'search_store';

let storage = {}
let timeAnchor = null;

export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            tagtabs: [],
            keyword: '',
            keyword_input: '', //分开有的手机输入时会有重字问题
            usage: 'house', //house 查房屋, 标注房产数量, plot 查小区
            type: 0, //0不区分 1新房 2二手房 3租房
            focused: false,
            hots: [],
            stores: [],
            tips: [],
            /*搜索框获得焦点*/
            onFocus() {
            },
            /*搜索框输入*/
            onInputKeyword() {
            },
            /*选择搜索提示*/
            onSelectTip() {
            },
            /*选择热搜提示*/
            onSelectHot() {
            },
            /*选择历史搜索*/
            onSelectStore() {
            },
            /*确认搜索*/
            onConfirm() {
            },
            /*清除搜索框*/
            onClearKeyword() {
            },
            /*搜索框失去焦点*/
            onBlur() {
            }
        }
    },

    /**
     * 搜索组件
     * @param  {String}  keyword  初始搜索值
     * @param  {Boolean}  focused  是否初始选中
     * @param  {Function}  opts.onFocus  搜索框获得焦点回调函数
     * @param  {Function}  opts.onInputKeyword  搜索框输入回调函数
     * @param  {Function}  opts.onClearKeyword  清除搜索框回调函数
     * @param  {Function}  opts.onBlur  取消搜索回调函数
     * @return component component
     */
    init(opts = {}) {
        opts.keyword_input = opts.keyword;
        const options = Object.assign({}, this.setDefaults(), opts);
        options.type = parseInt(options.type);

        const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {
                //启动
                start() {
                    let self = this;
                    let data = this.getComponentData();
                    let _type = data.type === 0 ? 1 : data.type;

                    api.getTagsIndex("wzlm").then(resp => {
                        let json = resp.data;
                        console.log(json)
                        self.setData({
                            [`${SCOPE}.tagtabs`]: json.data
                        })
                    })

                },
                //搜索得到焦点
                focus() {
                    this.setData({
                        [`${SCOPE}.focused`]: true
                    });
                    typeof options.onFocus === 'function' && options.onFocus()
                },
                //搜索输入关键字
                inputKeyword(e) {
                    let self = this;
                    let keyword = e.detail.value;
                    this.setData({
                        [`${SCOPE}.keyword`]: e.detail.value
                    });
                    this.searchTips(keyword);
                    typeof options.onInputKeyword === 'function' && options.onInputKeyword(keyword, this);
                },
                //清除关键字
                clearKeyword(e) {
                    this.setData({
                        [`${SCOPE}.keyword`]: '',
                        [`${SCOPE}.keyword_input`]: '',
                        [`${SCOPE}.tips`]: []
                    });
                    typeof options.onClearKeyword === 'function' && options.onClearKeyword()
                },
                //取消搜索
                cancel() {
                    this.setData({
                        [`${SCOPE}.focused`]: false
                    });
                    typeof options.onBlur === 'function' && options.onBlur()
                },
                //确认
                confirm(e) {
                    this.cancel();
                    let keyword = e.detail.value;
                    this.addStore(keyword)
                    typeof options.onConfirm === 'function' && options.onConfirm(keyword);
                },
                //查询搜索提示
                searchTips(keyword) {
                    if (timeAnchor) clearTimeout(timeAnchor);
                    timeAnchor = setTimeout(() => this._searchTips(keyword), 300);
                },
                _searchTips(keyword) {
                    let self = this;

                    if (keyword) {
                        api.getSearchTips(keyword).then(resp => {
                            let json = resp.data;
                            let data = self.getComponentData();

                            if (data.keyword === keyword) {
                                let [usage, type] = [data.usage, data.type];
                                let _tips = [];
                                json.data.forEach(function (item) {
                                    let name = item.name;
                                    let _item = {
                                        name: name,
                                        id: item.id
                                    }
                                    let index = name.indexOf(keyword);
                                    if (index > -1) {
                                        //数组方便<text>分组
                                        _item.texts = [name.substring(0, index), name.substring(index, index + keyword.length), name.substring(index + keyword.length)]
                                    } else {
                                        _item.texts = [name, '', '']
                                    }
                                    if (usage === 'plot') {
                                        //查询小区用 不区分 新房/二手房/租房
                                        _tips.push(Object.assign({type: 0}, _item))
                                        return;
                                    }
                                    // if ((type === 0 || type === 1) && /^在售$/.test(item.sale_status)) {
                                    if ((type === 0 || type === 1) && item.is_new == 1) {
                                        _tips.push(Object.assign({count: '', desc: '新房', type: 1}, _item));
                                    }
                                    if ((type === 0 || type === 2) && item.saling_esf_num != 0) {
                                        _tips.push(Object.assign({
                                            count: item.saling_esf_num,
                                            desc: '二手房',
                                            type: 2
                                        }, _item));
                                    }
                                    if ((type === 0 || type === 3) && item.saling_zf_num != 0) {
                                        _tips.push(Object.assign({
                                            count: item.saling_zf_num,
                                            desc: '租房',
                                            type: 3
                                        }, _item));
                                    }
                                });

                                _tips.sort((a, b) => (a.type - b.type));
                                self.setData({
                                    [`${SCOPE}.tips`]: _tips
                                })
                            }

                        })
                    } else {
                        this.setData({
                            [`${SCOPE}.tips`]: []
                        })
                    }

                },
                //选择搜索提示
                selectTip(e) {
                    this.addStore(this.getComponentData().keyword);

                    let obj = Object.assign({}, e.currentTarget.dataset);
                    // this.setData({
                    //   tips: [],
                    //   [`${SCOPE}.keyword`]: obj.name
                    //   [`${SCOPE}.keyword_input`]: obj.name
                    // })
                    this.cancel();
                    typeof options.onSelectTip === 'function' && options.onSelectTip(obj);
                },
                //选择热搜
                selectHot(e) {
                    let obj = Object.assign({}, e.currentTarget.dataset)
                    this.cancel();
                    typeof options.onSelectHot === 'function' && options.onSelectHot(obj);
                },

                //储存搜索值
                addStore(key) {
                    if (this.getComponentData().usage !== 'house') return;
                    let _type = this.getComponentData().type === 0 ? 1 : this.getComponentData().type;
                    let array = storage[_type] || [];
                    let index = array.findIndex(item => item.name === key);
                    if (index > -1) array.splice(index, 1);

                    array.unshift({
                        name: key,
                        time: new Date().getTime()
                    });
                    array.length > 5 && array.shift();
                    storage[_type] = array;

                    this.setData({
                        [`${SCOPE}.stores`]: array
                    })

                    wx.setStorage({
                        key: STORAGE_KEY,
                        data: storage
                    })
                },
                //选择历史
                selectStore(e) {
                    let name = e.target.dataset.name;
                    this.setData({
                        [`${SCOPE}.keyword`]: name,
                        [`${SCOPE}.keyword_input`]: name
                    })
                    this.addStore(name);
                    this.cancel();
                    typeof options.onSelectStore === 'function' && options.onSelectStore(name);
                },
                //清除历史
                clearStores() {
                    let _type = this.getComponentData().type === 0 ? 1 : this.getComponentData().type;
                    storage[_type] = [];
                    this.setData({
                        [`${SCOPE}.stores`]: []
                    })
                    wx.setStorage({
                        key: STORAGE_KEY,
                        data: storage
                    })
                }
            }
        })

        component.start();

        return component
    }
}