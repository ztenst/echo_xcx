import Component from '../component'
let app =getApp();
import api from '../../common/api'
export default {
	/**
	 * 默认参数
	 */
	setDefaults() {
		return {
			className: undefined,
	    	titleText: undefined,
			buttons: [], 
			buttonClicked() {}, 
			cancelText: `取消`, 
			cancel() {}, 
			// destructiveText: '删除', 
			// destructiveButtonClicked() {}, 
		}
    },
	/**
	 * 上拉菜单组件
	 * @param {Object} opts 配置项
	 * @param {String} opts.className 自定义类名
	 * @param {String} opts.titleText 标题
	 * @param {Array} opts.buttons 按钮
     * @param {String} opts.buttons.classNmae 按钮的类名
     * @param {String} opts.buttons.text 按钮的文字
	 * @param {Function} opts.buttonClicked 按钮点击事件
	 * @param {String} opts.cancelText 取消按钮的文本
	 * @param {Function} opts.cancel 取消按钮点击事件
	 * @param {String} opts.destructiveText 删除按钮的文本
	 * @param {Function} opts.destructiveButtonClicked 删除按钮点击事件
	 */
    show(type,opts = {}) {
        const SCOPE = `$actionSheet`;
        const options = Object.assign({
            type:type,
            animateCss: undefined,
            visible: !1,
        }, this.setDefaults(), opts);


    	// 实例化组件
    	const component = new Component({
            scope: SCOPE,
            data: options,
            methods: {
                /**
                 * 隐藏
                 */
                removeSheet(callback) {
                    if (this.removed) return !1
                    this.removed = !0
                    this.setHidden([`weui-animate-slide-down`, `weui-animate-fade-out`])
                    typeof callback === `function` && callback(options.buttons)
                },
                /**
                 * 显示
                 */
                showSheet() {
                    if (this.removed) return !1
                    this.setVisible([`weui-animate-slide-up`, `weui-animate-fade-in`])
                },
                /**
                 * 按钮点击事件
                 */
                buttonClicked(e) {
                    const index = e.currentTarget.dataset.index
                    if (options.buttonClicked(index, options.buttons[index]) === true) {
                        this.removeSheet()
                    }
                },
                /**
                 * 取消按钮点击事件
                 */
                cancel() {
                    this.removeSheet(options.cancel)
                },

                /**
                 * 处理点击事件
                 */
                dealClick(e){
                    let  self = this;
                    let data = self.getComponentData();
                    let phone = e.currentTarget.dataset.phone.replace(/[u4E00-u9FA5]/g, '')
                    if(!app.globalData.isUser){
                        let url = '/pages/add_message/add_message';
                        app.goPage(url, null, false);
                        return;
                    }
                    if(data.type=='phone'){
                        wx.makePhoneCall({
                            phoneNumber: phone
                        })
                    }else if(data.type == 'fenxiao'){
                        let params= {
                            hid:data.hid,
                            uid:app.globalData.userInfo.id,
                            phone:phone
                        };
                        api.addCo(params).then(res=>{
                           console.log(res)
                        })
                    }
                },
            },
        })

        component.showSheet()

    	return component.cancel
    },
}