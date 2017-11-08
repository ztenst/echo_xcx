import Component from '../component'
import mapUtil from '../../utils/map'

let app = getApp();

const SCOPE = '$houseSearchList';

export default {
  /**
   * 默认参数
   */
  setDefaults() {
    return {}
  },

  init(opts = {}) {
    const options = Object.assign({}, this.setDefaults(), opts);
    const component = new Component({
      scope: SCOPE,
      data: options,
      methods: {
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