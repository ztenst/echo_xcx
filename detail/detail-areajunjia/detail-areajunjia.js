var wxCharts = require('../../libs/wxcharts.js');
var api = require('./../../common/api');
var lineChart = null;

const DetailAreaJunjia = {
    showCharts(data){
        let that = this;
        var series = [];
        Object.keys(data.data.datas).forEach(key => {
            series.push(data.data.datas[key])
        });
        var qushi = {
            canvasId: 'lineCanvas',
            type: 'line',
            categories: data.data.categories,
            animation: true,
            background: '#ffffff',
            series: series,
            xAxis: {
                disableGrid: false,
                fontColor: '#666666',
                gridColor: '#999999'
            },
            yAxis: {
                format: function (val) {
                    return val + 'k';
                },
                fontColor: '#666666',
                gridColor: '#999999',
                titleFontColor: '#f7a35c',
                min: 0
            },
            width: wx.getStorageSync('kScreenW'),
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'straight',
                legendTextColor: '#333333',
                legendHeight: 50
            },
        }
        lineChart = new wxCharts(qushi);
        lineChart.addEventListener('renderComplete', () => {
            that.setData({
                'renderLineChartComplete': true
            });
            wx.canvasToTempFilePath({
                canvasId: 'lineCanvas',
                success: function success(res) {
                    wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: function success(data) {
                            that.setData({
                                lineTempFilePath: data.savedFilePath
                            });
                        }
                    });
                }
            });
        });
    },
    createSimulationData (type, id) {
        let that = this;
        let apiname = type === 'esf' ? 'getPlotChart' : 'getMplotPrice';
        api["getPlotChart"](id).then(obj => {
            if (obj.data.status === 'success') {
                that.showCharts(obj.data);
            }else{
                that.setData({
                    failedLoadChart : true
                })
            }
        });
    },
    //初始化地区均价图标
    initDetailAreaJunjia(type, id) {
        let that = this;
        that.createSimulationData(type, id);

    },
};

export default DetailAreaJunjia;
