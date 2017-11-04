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
          // let pages = getCurrentPages();

          // let searchListTimes = pages.filter(item => item.route === 'pages/house_list/house_list').length;

          // console.log(searchListTimes);

          let dataset = e.currentTarget.dataset;
          let url = '/pages/house_detail/' + ['new_house_detail', 'esf_house_detail', 'rent_house_detail'][dataset.type - 1] + '?id=' + dataset.id;
          app.goPage(url, null, false);
        }
      }
    });

    return component;
  }
}