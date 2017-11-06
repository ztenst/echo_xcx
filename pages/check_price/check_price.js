import {
  $searchBar,
  $wuxtoast
} from '../../components/wxcomponents'
import wxCharts from '../../libs/wxcharts'
import api from '../../common/api'
import Util from '../../utils/util.js'

let app = getApp();
let searchBar;
let windowWidth = 0;

//处理变化率
function handleRate(rate) {
  let text = ``,
    className = '';
  let _rate = parseFloat(rate)
  if (_rate < 0) {
    text += `${rate}%`
    className = 'down-color'
  } else if (_rate > 0) {
    text += `${rate}%`
    className = 'up-color'
  } else if (_rate === 0) {
    text = '0%';
  } else {
    text = rate; //暂无
  }
  return {
    text,
    className
  }
}

//处理返回信息
function handleResp(data = {}) {
  data.month_rate = handleRate(data.month_rate);
  data.year_rate = handleRate(data.year_rate);

  let prices = data.area_prices.map(item => {
    return (parseInt(item.price) || 0)
  })

  let maxPrice = Math.max.apply(null, prices);
  let minPirce = Math.min.apply(null, prices);

  data.area_prices.forEach(item => {
    item.rate = handleRate(item.rate);
    item._barWidth = (parseInt(item.price) || 0) / maxPrice * 450;
  })
  return data;
}

Page({
  data: {
    tab: 1,
    xf_trend: {},
    esf_trend: {},

    siteConfig: {},

    search_plot: false,

    plot: {
      id: '',
      name: ''
    },

    //表单中的朝向
    faces: ['不限', '南', '东', '西', '北', '东南', '西南', '西北', '东北'],
    face_index: 0,
  },
  onLoad(query) {
    let self = this;
    app.getSiteConfig().then(s => self.setData({ siteConfig: s }));
    this.loadData(this.data.tab);

    searchBar = $searchBar.init({

      usage: 'plot',
      onBlur() {
        self.setData({
          search_plot: false,
        });
        // if (wx.pageScrollTo) {
        //   setTimeout(() => { wx.pageScrollTo({ scrollTop: 1000 }) }, 100)
        // }
      },
      onSelectTip(tip) {
        self.setData({
          plot: {
            id: tip.id,
            name: tip.name
          }
        })
      }

    });

    // if (query.position === 'bottom' && wx.pageScrollTo) {
    //   setTimeout(() => { wx.pageScrollTo({ scrollTop: 1000 }) }, 300)
    // }
  },

  //请求数据
  loadData(tab) {
    let self = this
    let type = tab == 1 ? 'xf' : 'esf';

    if (!this.data[`${type}_trend`].month) {

      let apiName = this.data.tab == 1 ? 'getXfPriceTrend' : 'getEsfPriceTrend'

      api[apiName]().then(resp => {
        let data = handleResp(resp.data.data);

        self.setData({
          [`${type}_trend`]: data
        })

        setTimeout(() => {
          self.drawAreaChart(type);
        }, 300)
        this.drawTimeChart(type, data.half_prices.reverse());

      })
    }

  },

  //切换tab
  changeTab(e) {
    let tab = e.target.dataset.tab;
    this.setData({
      tab: tab
    });
    this.loadData(tab);
  },

  //由tab渲染数据
  setPriceData() {
    let _data = Object.assign({}, this.data.tab == 1 ? xfData : esfData)

    this.setData(_data);
    setTimeout(this.drawAreaCharts, 300);
    drawTimeCharts(this.data.half_prices);
  },
  //时间价格Canvas
  drawTimeChart(type, array) {
    if (!windowWidth) {
      try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
      } catch (e) {
        windowWidth = 320;
        console.error('getSystemInfoSync failed!');
      }
    }

    let self = this;
    let months = array.map(item => item.date);
    let prices = array.map(item => parseInt(item.price) || 0)

    let maxPrice = Math.max.apply(null, prices)
    let minPirce = Math.min.apply(null, prices)
    let diff = (maxPrice - minPirce + 1e3) * (maxPrice + 1e3) / (minPirce + 1e3);

    let chart = new wxCharts({
      canvasId: `time-chart-${type}`,
      type: 'area',
      legend: false,
      dataLabel: false,
      fontSize: 12,
      categories: months,
      series: [{
        xianColor: "#999999",
        data: prices,
      }],
      xAxis: {
        gridColor: '#999999',
        fontColor: '#999999',
        disableGrid: true
      },
      yAxis: {
        title: null,
        max: Math.ceil((maxPrice + diff * 0.2) / 1e3) * 1e3,
        min: Math.max(0, Math.floor((minPirce - diff * 0.2) / 1e3) * 1e3),
        fontColor: '#ffffff',
        disabled: true
      },
      width: windowWidth,
      height: windowWidth / 750 * 400,
      extra: {
        lineStyle: 'straight',
      },
    });

    chart.addEventListener('renderComplete', () => {

      wx.canvasToTempFilePath({
        canvasId: `time-chart-${type}`,
        success(res) {
          self.setData({
            [`${type}_trend.time_chart_img`]: res.tempFilePath
          });

        }
      });

    });
  },

  //区域价格
  drawAreaChart(type) {
    let prices = [].concat(this.data[`${type}_trend`].area_prices);
    prices.forEach(function (item, index) {
      item.barWidth = item._barWidth
    })

    this.setData({
      [`${type}_trend.area_prices`]: prices
    })
  },

  searchPlot(e) {
    this.setData({
      search_plot: true
    });
    searchBar.focus();
  },

  selectFace(e) {
    this.setData({
      face_index: parseInt(e.detail.value) || 0
    })
  },

  checkPrice(e) {
    let vals = e.detail.value;
    let plot = this.data.plot;
    let [size, price, floor, total_floor] = [parseInt(vals.size), parseInt(vals.price), parseInt(vals.floor), parseInt(vals.total_floor)];

    console.log(vals)

    if (!plot.name || !plot.id) {
      toast('请选择小区');
      return;
    }

    if (vals.size === '') {
      toast('请填写面积');
      return;
    }
    if (size < 1 || size > 10000) {
      toast('面积必须在1到10000之间')
      return;
    }

    if (vals.face == 0) {
      toast('请选择朝向')
      return;
    }

    if (vals.floor === '') {
      toast('请填写楼层');
      return;
    }
    if (floor < -99 || floor > 99) {
      toast('楼层必须在-99到99之间')
      return;
    }
    if (vals.total_floor === '') {
      toast('请填写总楼层');
      return;
    }
    if (floor > total_floor) {
      toast('总楼层不能小于所在楼层')
      return;
    }

    if (vals.price === '') {
      toast('请填写总价');
      return;
    }
    if (price < 1 || price > 1e6) {
      toast('价格必须在1万到100000万之间')
      return;
    }
    let face = this.data.faces[vals.face];

    api.getPlotInfo(plot.id).then(resp => {
      let json = resp.data;
      let est_price = Math.round(json.data.price * parseInt(vals.size) / 1e4);
      let rate = Math.round(est_price / parseInt(vals.price) * 100) - 100;

      let params = {
        plot: plot.name,
        size,
        face,
        floor,
        total_floor,
        price,
        est_price,
        rate
      }

      wx.navigateTo({
        url: `house_estimate?${Util.params2Query(params)}`
      })

    })

  },
  onShareAppMessage(res) {
    return {
      title: `${this.data.siteConfig.city_name || ''}查房价 看看您家房子值多少钱`
    }
  }

});

//展示
function toast(text) {
  $wuxtoast.show({
    type: 'text',
    timer: 2e3,
    text: text,
  })
}