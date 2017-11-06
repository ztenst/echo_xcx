import Component from '../component'
import api from '../../common/api'
import $wuxtoast from '../toast/toast'
import Util from '../../utils/util'

const SCOPE = '$searchFilter';

const OTHER_ATTRS = {
  //新房
  xmts: '项目特色',
  wylx: '物业类型',
  zxzt: '装修状态',
  xszt: '销售状态',
  kpsj: '开盘时间',

  //二手房
  sort: '排序',
  source: '来源',
  size: '面积',
  floor: '楼层',
  face: '朝向',
  age: '楼龄',
  zx: '装修',
  ts: '特色',
  zfmode: '方式'
}

//取得筛选字段
function getFilterKeys(type, area_fixed) {
  let arr = ['pricetag', 'bedroom']; //价格, 户型
  //其他
  if (type == 1) {
    arr = arr.concat(['sort', 'xmts', 'wylx', 'zxzt', 'xszt', 'kpsj'])
  } else {
    arr = arr.concat(['minprice', 'maxprice']).concat(['sort', 'source', 'size', 'floor', 'face', 'age', 'zx', 'ts', 'zfmode']);
  }
  if (!area_fixed) arr = arr.concat(['area', 'street'])
  return arr;
}

//取得其他筛选字段
function getOtherKeys(type, area_fixed) {
  if (type == 1) {
    return ['sort', 'xmts', 'wylx', 'zxzt', 'xszt', 'kpsj']
  }
  let arr = ['sort', 'source', 'size', 'floor', 'face', 'age', 'zx', 'ts', 'zfmode']
  if (area_fixed) {
    if (type == 2) arr.splice(2, 1)
    if (type == 3) arr.splice(8, 1)
  }
  return arr;
}

export default {
  /**
   * 默认参数
   */
  setDefaults() {
    return {
      type: 1, //1新房 2二手房 3租房
      area_fixed: false, //没有小区筛选项
      tab: '',

      area_index: 0, //area_index区域数组的index, 非筛选字段
      area_filters: [],
      price_filters: [],
      huxing_filters: [],
      size_filters: [],
      zfmode_filters: [],
      other_filters: [],

      titles: {
        area: '',
        price: '',
        huxing: '',
        size: '',
        zfmode: '',
        other: ''
      },

      filters: {},

      onFilter() {} //搜索回调方法
    }
  },

  assign(opts) {
    let options = Object.assign({}, this.setDefaults(), opts);
    options.type = parseInt(options.type);
    options.type === 1 && (options.area_fixed = false);

    let keys = getFilterKeys(options.type, options.area_fixed);
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
        setTab(e) {
          let index = e.currentTarget.dataset.index;

          let _index = this.getComponentData().tab;

          this.setData({
            [`${SCOPE}.tab`]: index == _index ? '' : index
          });
        },

        requestOptions() {
          let self = this;
          let data = self.getComponentData();
          let [type, area_fixed] = [data.type, data.area_fixed];

          let empty = {
            id: '',
            name: '不限'
          };

          let ajaxs = [];

          if (!area_fixed) {
            ajaxs.push(api.getFilterAreas().then(resp => {
              let json = resp.data;
              let areas = [Object.assign(empty, { childAreas: [] })].concat(json.data.area)
              self.setData({
                [`${SCOPE}.area_filters`]: areas
              })
              if (data.filters.area) {
                let i = areas.findIndex(item => item.id == data.filters.area)
                if (i > -1) {
                  self.setData({
                    [`${SCOPE}.area_index`]: i
                  })
                }
              }
            }))
          }

          ajaxs.push(api.getFilterTags(['xinfangjiage', 'esfzzprice', 'zfzzprice'][type - 1]).then(resp => {
            let json = resp.data;
            self.setData({
              [`${SCOPE}.price_filters`]: [empty].concat(json.data.list)
            })
          }))

          ajaxs.push(api.getFilterTags(['xinfanghuxing', 'resoldhuxing', 'resoldhuxing'][type - 1]).then(resp => {
            let json = resp.data;
            self.setData({
              [`${SCOPE}.huxing_filters`]: [empty].concat(json.data.list)
            })
          }))

          ajaxs.push(api.getFilterTags(['xfmore', 'esfzzmore', 'zfzzmore'][type - 1]).then(resp => {

            let json = resp.data;
            let data = json.data;
            let _list = [];

            //租房方式前面有个不限
            // if (data.zfmode) {
            //   data.zfmode.shift();
            // }

            if (area_fixed && type === 2) {
              self.setData({
                [`${SCOPE}.size_filters`]: [empty].concat(json.data.size)
              })

              delete data.size;
            }
            if (area_fixed && type === 3) {
              self.setData({
                [`${SCOPE}.zfmode_filters`]: [empty].concat(json.data.zfmode)
              })

              delete data.zfmode;
            }

            for (let i in data) {
              if (data[i].length > 0) {
                _list.push({
                  key: i,
                  title: OTHER_ATTRS[i],
                  array: [empty].concat(data[i])
                })
              }
            }

            self.setData({
              [`${SCOPE}.other_filters`]: _list
            })

          }))

          Promise.all(ajaxs).then(vals => {
            self.triggerFilter();
          })

        },

        /*各个设置筛选*/
        setArea(e) {
          this.setFilter(e, {
            [`${SCOPE}.area_index`]: e.target.dataset.areaindex,
            [`${SCOPE}.filters.street`]: '0'
          });
          if (e.target.dataset.areaindex == 0) {
            this.triggerFilter();
          }
        },
        //选中后立即搜索
        filterNow(e) {
          this.setFilter(e)
          this.triggerFilter();
        },

        inputMinprice(e) {
          this.setData({
            [`${SCOPE}.filters.minprice`]: e.detail.value
          })
        },
        inputMaxprice(e) {
          this.setData({
            [`${SCOPE}.filters.maxprice`]: e.detail.value
          })
        },
        setPriceRange(e) {
          let filters = this.getComponentData().filters;
          let [minprice, maxprice] = [parseInt(filters.minprice), parseInt(filters.maxprice)];

          if (isNaN(minprice) || isNaN(maxprice) || minprice >= maxprice) {
            $wuxtoast.show({
              type: 'text',
              timer: 2e3,
              text: '最低价不能高于最高价',
            })
          } else {
            this.setData({
              [`${SCOPE}.filters.pricetag`]: '',
            });

            this.triggerFilter()
          }
        },
        //其他筛选确定
        setOther(e) {
          this.triggerFilter();
        },

        /*设置筛选条件基础方法*/
        setFilter(e, otherParams = {}) {
          let key = e.target.dataset.key;
          let value = e.target.dataset.id;

          let params = Object.assign({
            [`${SCOPE}.filters.${key}`]: value
          }, otherParams);

          this.setData(params);

        },

        /*重置其他*/
        resetOthers() {
          let data = this.getComponentData();
          let obj = {};
          let keys = getOtherKeys(data.type, data.area_fixed);
          keys.forEach(key => obj[key] = '')

          let f = Object.assign(data.filters, obj)

          this.setData({
            [`${SCOPE}.filters`]: f
          })
        },
        //加入筛选条件
        // push(f){
        //   let filters = this.getComponentData().filters;
        //   this.setData({
        //     [`${SCOPE}.filters`]: Object.assign(filters, f)
        //   })
        //   this.triggerFilter();
        // },

        //更新标题
        updateTitles() {
          let data = this.getComponentData();
          let filters = data.filters;
          let titles = data.titles;
          //初始化
          Object.keys(titles).forEach(i => titles[i] = '')

          //区域
          if (filters.area && data.area_filters.length > 0) {
            let area = data.area_filters[data.area_index];
            if (!filters.street || filters.street == 0) {
              titles.area = area.name;
            } else {
              let s = area.childAreas.find(item => filters.street == item.id);
              if (s) titles.area = s.name;
            }
          }

          //价格
          if (filters.pricetag && data.price_filters.length > 0) {
            let s = data.price_filters.find(item => filters.pricetag == item.id);
            if (s) titles.price = s.name;
          }
          if (filters.minprice && filters.maxprice) {
            titles.price = `${filters.minprice}-${filters.maxprice}${data.type === 3?'元':'万'}`
          }

          //户型
          if (filters.bedroom && data.huxing_filters.length > 0) {
            let s = data.huxing_filters.find(item => filters.bedroom == item.id);
            if (s) titles.huxing = s.name;
          }

          //面积
          if (filters.size && data.size_filters.length > 0) {
            let s = data.size_filters.find(item => filters.size == item.id);
            if (s) titles.size = s.name;
          }

          //租房方式
          if (filters.zfmode && data.zfmode_filters.length > 0) {
            let s = data.zfmode_filters.find(item => filters.zfmode == item.id);
            if (s) titles.zfmode = s.name;
          }

          if (data.other_filters.length > 0) {
            let i = 0;
            getOtherKeys(data.type, data.area_fixed).forEach(key => {
              if (filters[key]) i++;
            })
            titles.other = i;
          }

          this.setData({
            [`${SCOPE}.titles`]: titles
          })
        },

        /*筛选最终触发事件*/
        triggerFilter() {
          this.setData({
            [`${SCOPE}.tab`]: ''
          });

          this.updateTitles();
          let data = this.getComponentData();

          let filters = Object.assign({}, data.filters);

          if (filters.street == 0) filters.street = '';

          //新房特殊
          if (data.type === 1) {
            //area核street只取一个
            filters.place = filters.street === '' ? filters.area : filters.street

            filters.xinfangjiage = filters.pricetag
            filters.xinfanghuxing = filters.bedroom
            // delete filters.area;
            // delete filters.street;
            // delete filters.pricetag;
            // delete filters.bedroom;
          }

          let params = Util.filterEmpty(filters);

          console.log(params);
          console.log(Util.params2Query(params));

          typeof options.onFilter === 'function' && options.onFilter(params, data.titles);
        }

      }
    });

    component.requestOptions();

    return component;
  }
}