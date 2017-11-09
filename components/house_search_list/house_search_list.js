import Component from '../component'
import mapUtil from '../../utils/map'
import Util from '../../utils/util'

let app = getApp();

const SCOPE = '$houseSearchList';

export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            filters: {},
            onFilter() {
            } //回调方法
        }
    },

    init(opts = {}) {
        const options = Object.assign({}, this.setDefaults(), opts);
        const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {

                filterCompany(e){
                    let filters = {'company':''};
                    if(e.currentTarget.dataset.company){
                        let dataset = e.currentTarget.dataset;
                        this.setData({
                            [`${SCOPE}.company`]: dataset.company.name
                        });
                        filters = {'company':dataset.company.id};
                    }else{
                        this.setData({
                            [`${SCOPE}.company`]: ""
                        });
                    }

                    typeof options.onFilter === 'function' && options.onFilter(filters);
                },
                navigateDetail(e) {
                    let dataset = e.currentTarget.dataset;
                    let url = '/pages/house_detail/house_detail?id=' + dataset.id;
                    app.goPage(url, null, false);
                }
            }
        });
        return component;
    }
}