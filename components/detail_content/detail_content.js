import Component from '../component'
import Util from '../../utils/util'

var WxParse = require('../../libs/wxParse/wxParse.js');


export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            callback() {},
        }
    },
    /**
     * 渲染xnumber组件
     * @param {String} id   唯一标识
     * @param {Object} opts 配置项
     * @param {Number} opts.content 默认值
     * @param {Function} opts.callback 监听值变化的回调函数
     */
    init(id, opts = {}) {
        const SCOPE = `$detailContent.${id}`;
        const options = Object.assign({
            id,
        }, this.setDefaults(), opts);

        // 实例化组件
        const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {
                updateContent(data) {
                    let self = this;
                    /**
                     * html解析示例
                     */
                    let d = [];
                    d.push(WxParse.wxParse(self.getComponentData().updateContent, 'html',data, self));
                    Promise.all(d).then(res => {
                        if(data){
                            self.showDetailContent(self.getComponentData().updateContent.node);
                        }
                    });
                },
                zsTap: function (e) {
                    let self = this;
                    self.page.setData({
                        [`${SCOPE}.isShowExtend`]:!self.getComponentData().isShowExtend
                    });
                },
                showDetailContent: function (id) {
                    let self = this;
                    let ID = Util.stripscript(id);//过滤特殊字符
                    self.page.setData({
                        [`${SCOPE}.ID`]:ID
                    });
                    var query = wx.createSelectorQuery();
                    setTimeout(() => {
                        query.select('#'+ID).fields({
                            size: true,
                        }, function (res) {
                            if (res.height > 150) {
                                self.page.setData({
                                    [`${SCOPE}.isShowExtend`]:true,
                                    [`${SCOPE}.canExtend`]:true
                                });
                            } else {
                                self.page.setData({
                                    [`${SCOPE}.isShowExtend`]:false,
                                    [`${SCOPE}.canExtend`]:false
                                });
                            }
                        }).exec();
                    }, 1000)
                },
            },
        });

        // 初始化时立即更新一次组件
        component.updateContent(options.content)
        return component;
    },
}