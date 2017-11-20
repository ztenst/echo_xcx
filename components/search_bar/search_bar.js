import Component from '../component'
import api from '../../common/api'
import Util from '../../utils/util'

const SCOPE = '$searchBar';
let timeout = null;

//取得筛选字段
function getFilterKeys() {
    return [ 'kw','save'];
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
            placeholder_text:'',
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

        }
    },

    assign(opts) {
        let options = Object.assign({}, this.setDefaults(), opts);
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
                    });
                    this.triggerFilter();
                    typeof options.onClearkw === 'function' && options.onClearkw()
                },
                //搜索
                doSearch() {
                    this.triggerFilter();
                },

                requestOptions() {
                    let self = this;
                    self.triggerFilter();
                },



                /*筛选最终触发事件*/
                triggerFilter() {
                    let data = this.getComponentData();

                    let filters = Object.assign({}, data.filters);
                    let params = Util.filterEmpty(filters);

                    typeof options.onFilter === 'function' && options.onFilter(params, data.titles);
                }

            }
        });
        component.requestOptions();
        return component;
    }
}