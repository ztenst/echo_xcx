import Component from '../component'
import api from '../../common/api'
import Util from '../../utils/util'

const SCOPE = '$searchBar';

let timeAnchor = null;
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
            /*清除搜索框*/
            onClearkw() {
            },
            // 搜索按钮回调
            onSearch(){

            }
        }
    },

    init(opts = {}) {

        const options = Object.assign({}, this.setDefaults(), opts);

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
                    let kw = e.detail.value;
                    this.setData({
                        [`${SCOPE}.filters.kw`]: e.detail.value
                    });
                    if (timeAnchor) clearTimeout(timeAnchor);
                    timeAnchor = setTimeout(() => typeof options.onInputkw === 'function' && options.onInputkw(kw, this), 300);

                },
                //清除关键字
                clearkw(e) {
                    this.setData({
                        [`${SCOPE}.filters.kw`]: '',
                        [`${SCOPE}.filters.kw_input`]: '',
                    });

                    typeof options.onClearkw === 'function' && options.onClearkw()
                },
                //搜索
                doSearch() {
                    let data = this.getComponentData();
                    let keyword = data.filters.kw;
                    typeof options.onSearch === 'function' && options.onSearch(keyword);
                }
            }
        });
        return component;
    }
}