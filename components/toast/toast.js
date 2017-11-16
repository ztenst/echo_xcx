import Component from '../component'

export default {
    /**
     * 默认参数
     */
    setDefaults() {
        return {
            timer: 1500,
            text: ``,
            success() {},
        }
    },
    /**
     * 显示toast组件
     * @param {Object} opts 配置项
     * @param {String} opts.type 提示类型
     * @param {Number} opts.timer 提示延迟时间
     * @param {String} opts.color 图标颜色
     * @param {String} opts.text 提示文本
     * @param {Function} opts.success 关闭后的回调函数
     */
    show(opts = {}) {
        const options = Object.assign({}, this.setDefaults(), opts)


        // 实例化组件
        const component = new Component({
            scope: `$toast`,
            data: options,
            methods: {
                /**
                 * 隐藏
                 */
                hide(cb) {
                    setTimeout(() => {
                        this.setHidden()
                        typeof cb === `function` && cb()
                    }, options.timer)
                },
                /**
                 * 显示
                 */
                show() {
                    this.setVisible()
                },
            },
        })

        component.show()
        component.hide(opts.success)
    },
}