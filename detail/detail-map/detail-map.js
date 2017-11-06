import config from '../../config'
//国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
var coordtransform = require('./../../utils/coordtransform');
var app = getApp();
var util = require('../../utils/util');
const DetailMap = {
    //初始化轮播图
    initDetailMap(latitude, longitude, title, address) {
        let that = this;
        that.setData({longitude: longitude, latitude: latitude, address: address, mapAddressTitle: title});
        console.log(latitude, longitude)

        var width = wx.getStorageSync('kScreenW'),
            lng = longitude,
            lat = latitude,
            zoom = 18,
            scale = 2,
            copyright = 1,
            markerStyles = `-1,${config.static_path}/wz-map.png`,
            mapurl = "https://api.map.baidu.com/staticimage/v2?ak=415167759dc5861ddbbd14154f760c7e&mcode=666666&copyright=" + copyright + "&coordtype=bd09ll&center=" + lng + "," + lat + "&markers=" + lng + "," + lat + "&markerStyles=" + markerStyles + "&width=" + width + "&height=150&zoom=" + zoom + "&scale=" + scale;
        that.setData({src: mapurl})
    },
    //跳转到小区周边详细页
    gotomapdetail: function (e) {
        let that = this;
        //百度经纬度坐标转国测局坐标
        var bd09togcj02 = coordtransform.bd09togcj02(that.data.longitude, that.data.latitude);
        app.goPage("esf_house_mapdetail",util.query2Params("lat=" + bd09togcj02[1] + "&lng=" + bd09togcj02[0] + "&name=" + that.data.mapAddressTitle + ""),false)
    }
};

export default DetailMap;