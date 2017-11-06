var mapCtx; // 地图上下文，用于获取或设置中心坐标，在定位成功后初始化
var mapHeight; // 地图控件高度，在onLoad获取页面高度后计算
var mapWidth; // 地图控件宽度，在onLoad获取页面宽度后计算
var MAP_HEIGHT_SCALA = 0.91; // 高度占总高度比例
var MAP_WIDTH_SCALA = 1; // 宽度占总宽度比例
var DEFAULT_SCALA = 15; // 默认缩放，范围5-18
var location = {}; // 定位坐标
var search; // 搜索框文本
var locationMarker = {};
var markers = [
    locationMarker
]; // 地图标记

Page({
    data: {
        value: '', // 输入框清空
    },
    // 添加地图中心控件
    addLocationMarker: function (lat,lng,name) {
        let that = this;
        locationMarker = {
            id: 0,
            iconPath: '../../images/wz-map.png',
            latitude: lat,
            longitude: lng,
            width: 17.33333,
            height: 26,
            callout:{
                content:name,
                borderRadius:4,
                fontSize:12,
                padding:8,
                display:'ALWAYS'
            }
        }
        that.setData({
            markers: [locationMarker],
        })
    },
    // 搜索按钮点击事件
    onSearchTap: function (e) {
        var that = this;
        search = e.currentTarget.dataset.type;
        that.onSearch(e.currentTarget.dataset.type)
    },
    onSearch:function (search) {
        var that = this;
        // 调用接口
        let searchparam = {
            query: search || '生活服务$美食&酒店',
            scope: 1,
            filter: '',
            coord_type: 2,
            page_size: 10,
            page_num: 0,
            output: 'json',
            ak: '415167759dc5861ddbbd14154f760c7e',
            sn: '',
            timestamp: '',
            radius: 2000,
            ret_coordtype: 'gcj02ll',
            location:that.data.location.latitude+","+that.data.location.longitude
        };
        let type = 'gcj02';
        wx.request({
            url: 'https://api.map.baidu.com/place/v2/search',
            type: 'get',
            data: searchparam,
            header: {
                "content-type": "application/json"
            },
            method: 'GET',
            success(data) {
                let res = data["data"];
                if (res["status"] === 0) {
                    let poiArr = res["results"];
                    that.clearCollectionMarker();
                    that.addCollectionMarker(poiArr)
                }
            },
            fail(data) {

            }
        });
    },
    // 将点添加到标记中
    addCollectionMarker: function (colFromCloud) {
        let that = this;
        for (var i = 0; i < colFromCloud.length; ++i) {
            // 添加标记
            markers.push({
                id: colFromCloud[i].id,
                iconPath: that.getIconPath(search),
                latitude: colFromCloud[i].location.lat,
                longitude: colFromCloud[i].location.lng,
                width: mapWidth * 0.1,
                height: mapWidth * 0.1,
                callout:{
                    content:"名称:"+colFromCloud[i].name+" \n "+"地址:"+(colFromCloud[i].address?colFromCloud[i].address:'暂无'),
                    borderRadius:4,
                    fontSize:12,
                    padding:10,
                    display:'BYCLICK'
                }
            });
        }
        that.setData({
            markers: markers,
        });
    },

    // 清空标记
    clearCollectionMarker: function () {
        let that = this;
        markers = [locationMarker];
        that.setData({
            markers: markers,
        });
    },

    onLoad: function (options) {
        var that = this;
        that.setData({
            location : {
                latitude: options.lat,
                longitude: options.lng,
            }
        });
        // 设置地图大小
        mapHeight = wx.getStorageSync("kScreenH") * MAP_HEIGHT_SCALA;
        mapWidth = wx.getStorageSync("kScreenW") * MAP_WIDTH_SCALA;
        that.setData({
            mapHeight: mapHeight + 'px',
            mapWidth: mapWidth + 'px'
        })
        location = {
            latitude: options.lat,
            longitude: options.lng,
        };
        that.addLocationMarker(options.lat,options.lng,options.name); // 添加中心图标
        search = '交通';
        that.onSearch(search)
        // 更新数据
        that.setData({
            position: location, // 定位坐标
            scala: DEFAULT_SCALA, // 缩放比例[5-18]
            markers: markers, // 标记点
        });
        mapCtx = wx.createMapContext('map');
    },

    getIconPath: function (type) {
        if (type === '交通') {
            return  '../../images/icon-jiaotong.png';
        } else if (type === '学校') {
            return  '../../images/icon-jiaoyu.png';
        } else if (type === '美食') {
            return '../../images/icon-meishi.png';
        } else if (type === '健康') {
            return  '../../images/icon-jiankang.png';
        } else if (type === '生活') {
            return  '../../images/icon-shenghuo.png';
        }
    }
})