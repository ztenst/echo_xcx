import Component from '../component'
let app = getApp();

const SCOPE = '$houseSearchList';

export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            onFilter() {
            } //回调方法
        }
    },

    init(opts = {}) {
        const options = Object.assign({}, this.setDefaults(), opts,{is_true: false});
        
        const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {
                filterCompany(e){
                    let filters = {'company': '','companyname':""};
                    let dataset = e.currentTarget.dataset;
                    if (dataset.company) {
                        filters = {'company': dataset.company.id,'companyname':dataset.company.name};
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