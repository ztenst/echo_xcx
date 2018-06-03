import Component from '../component'
const SCOPE = '$loginDialog';

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
    const component = new Component({
      scope: SCOPE,
      data: options,
      methods: {
         /**
         * 微信授权，获取用户信息
         * @param resuserinfo
         */
        gotUserInfo(resuserinfo) {
         

        },
         /**
         * 关闭授权框
         */
        close(){
          // let self = this;
          // self.setData({
          //   needLogin: false
          // });
        }
      }
    });
    return component;
  }
}