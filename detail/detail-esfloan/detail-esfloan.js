var wxCharts = require('../../libs/wxcharts.js');
var api = require('./../../common/api');
var ringChart = null;
const DetailEsfLoan = {
    //初始化地区房贷图
    initDetailEsfLoan(price) {
        let that =this;
        let  width = wx.getStorageSync('kScreenW')/750*250,
             height = wx.getStorageSync('kScreenW')/750*250;
        that.setData({total:parseInt(price)});
        if(parseInt(price)&&parseInt(price)>0){
            api.getBorrow(price).then(obj => {
                let loanData = obj.data.data;
                for (let item in loanData) {
                    loanData[item] = parseInt(loanData[item]);
                };
                that.setData({
                    fangdai:loanData
                });;
                ringChart = new wxCharts({
                    // animation: true,
                    canvasId: 'ringCanvas',
                    type: 'ring',
                    series: [{
                        name: '首付',
                        data: loanData.first,
                        stroke: false,
                        color:'#28cc87'
                    }, {
                        name: '贷款',
                        data: loanData.borrow,
                        stroke: false,
                        color:'#fe8067'
                    }, {
                        name: '利息',
                        data: loanData.all,
                        stroke: false,
                        color:'#ffa726'
                    }],
                    disablePieStroke: false,
                    width: width,
                    height: height,
                    dataLabel: false,
                    legend: false,
                    padding: 0
                });
                ringChart.addEventListener('renderComplete', () => {
                    that.setData({
                        'renderRingChartComplete':true
                    })
                    wx.canvasToTempFilePath({
                        canvasId: 'ringCanvas',
                        success: function success(res) {
                            that.setData({
                                ringTempFilePath: res.tempFilePath
                            });
                        }
                    });
                });
            });
        }
    },
};
export default DetailEsfLoan;