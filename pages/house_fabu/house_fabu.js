import { $toast} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

const qiniuUploader = require("../../utils/qiniuUploader");

function getKey() {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var key = '';
    var time = new Date().getTime();
    var Range = 999999 - 100000;
    var Rand = Math.random();
    var num = 100000 + Math.round(Rand * Range);
    return key + myDate.getFullYear() + '/' + (month < 10 ? "0" + month : month) + (day < 10 ? "0" + day : day) + '/' + new Date().getTime() + num + '.jpg';
}

function didPressChooesImage(that) {
    // initQiniu();
    // 微信 API 选文件
    wx.chooseImage({
        count: 1,
        success(res) {
            var filePath = res.tempFilePaths[0];
            // 交给七牛上传
            qiniuUploader.upload(filePath, (res) => {
                    that.data.uploadImgs.push(`http://` + res.imageURL);
                    that.setData({
                        currentFm: that.data.uploadImgs[0],
                        uploadImgs: that.data.uploadImgs
                    });
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                }
                , {
                    region: 'NCN', // 华北区
                    domain: 'oofuaem2b.bkt.clouddn.com',
                    uptokenURL: 'http://house.jj58.com.cn/api/image/qnUpload',
                    shouldUseQiniuFileName: false,
                    key: getKey(),
                }
            );
        }
    })
}

let app = getApp();

Page({
    data: {
        tags: {},
        areaList: [],
        streetList: [],
        unitList:[{id:1,name:'元/m2'},{id:2,name:'万元/套'}],
        areaIndex: 0,
        streetIndex: 0,
        sfpriceIndex: 0,
        unitIndex:0,

        uploadImgs: [],
        currentFm: 0,
    },
    onLoad() {
        let tags = {};
        this.setData({
            customInfo: app.globalData.customInfo,
            userInfo: app.globalData.userInfo,
        });
        if(app.globalData.customInfo.phone){
           this.checkPhoneCanSub(app.globalData.customInfo.phone);
        }
        api.publishtags().then(res => {
            let json = res.data;
            if (json.status == "success") {
                json.data.forEach((v, i) => {
                    if (v.name == 'area') {
                        var objectArray = v.list;
                        var areaList = [];
                        for (var i = 0; i < objectArray.length; i++) {
                            areaList.push(objectArray[i]);
                            if (i == objectArray.length - 1) {
                                this.setData({
                                    areaList: areaList,
                                    streetList: objectArray[this.data.areaIndex].childAreas
                                })
                            }
                        }
                    } else if (v.name == 'mode') {
                        var modeArray = v.list;
                        var modeList = [];
                        for (let key in modeArray) {
                            modeList.push({
                                name: modeArray[key],
                                id: key,
                            })
                        }
                        this.setData({
                            mode: modeList,
                        })
                    } else {
                        tags[v.name] = v.list;
                        this.setData({
                            tags: tags
                        });
                    }
                });
            }
        });
        //初始化表单校验组件
        this.WxValidate = app.WxValidate({
            'pname': {required: true}, //姓名
            'pphone': {  required: true, tel: true}, // 电话
            'pcompany': {required: true}, //公司
            'title': {required: true}, // 楼盘名
            'area': {required: true}, // 区域
            'street': {required: true}, // 街道
            'address': {required: true}, // 地址
            'wylx': {required: true}, //物业类型
            'zxzt': {required: true}, //装修状态
            'price': {required: true}, // 价格
            'unit': {required: true}, //单位 1为元/m2 2为万元/套
            'hxjs': {required: true}, // 户型介绍
            'sfprice': {required: true}, // 首付金额
            'dllx': {required: true}, // 代理类型
            'fm': {required: true}, // 封面
            'yjfa': {required: true}, //佣金方案
            'jy_rule': {required: true}, // 结佣规则
            'dk_rule': {required: true}, // 带看规则
            'peripheral': {required: true}, //项目介绍
            'image': {required: true}, // 图片 字符串数组
        }, {
            'pname': {required: '请输入姓名'}, //姓名
            'pphone': {required: '请填写正确格式的手机号码'}, // 电话
            'pcompany': {required: '请输入公司'}, //公司
            'title': {required: '请输入项目名称'}, // 项目名称
            'area': {required: '请输入区域'}, // 区域
            'street': {required: '请输入地址'}, // 街道
            'address': {required: '请输入地址'}, // 地址
            'wylx': {required: '请输入物业类型'}, //物业类型
            'zxzt': {required: '请输入装修状态'}, //装修状态
            'price': {required: '请输入价格'}, // 价格
            'unit': {required: '请输入单位'}, //单位 1为元/m2 2为万元/套
            'hxjs': {required: '请输入户型介绍'}, // 户型介绍
            'sfprice': {required: '请输入首付金额'}, // 首付金额
            'dllx': {required: '请输入代理类型'}, // 代理类型
            'fm': {required: '请输入封面'}, // 封面
            'yjfa': {required: '请输入佣金方案'}, //佣金方案
            'jy_rule': {required: '请输入结佣规则'}, // 结佣规则
            'dk_rule': {required: '请输入带看规则'}, // 带看规则
            'peripheral': {required: '请输入项目介绍'}, //项目介绍
            'image': {required: '请上传图片'}, // 图片 字符串数组
        });
    },
    checkPhone(e) {
        this.checkPhoneCanSub(e.detail.value)
    },
    checkPhoneCanSub(phone){
        api.checkCanSub({phone:phone}).then(res=>{
            let json =res.data;
            if(json.status!="success"){
                $toast.show({
                    timer: 2e3,
                    text: json.msg,
                });
            }
        });
    },
    checkTitle(e){
        api.checkName({name:e.detail.value}).then(res=>{
            let json =res.data;
            if(json.status!="success"){
                $toast.show({
                    timer: 2e3,
                    text: json.msg,
                });
            }
        });
    },
    //区域改变
    bindPickerAreaChange(e) {
        this.setData({areaIndex: e.detail.value, streetIndex: 0})
        var objectArray = this.data.areaList;
        this.setData({streetList: objectArray[e.detail.value].childAreas})
    },
    //街道改变
    bindPickerStreetChange(e) {
        this.setData({
            streetIndex: e.detail.value
        })
    },

    // 首付金额
    sfpriceChange(e) {
        this.setData({
            sfpriceIndex: e.detail.value
        })
    },
    // 单位
    unitChange(e) {
        this.setData({
            unitIndex: e.detail.value
        })
    },

    //改变封面
    changeFm(e) {
        const dataset = e.currentTarget.dataset
        const current = dataset.url;
        this.setData({
            currentFm: current
        })
    },
    //删除图片
    deleteUploadImg(e) {
        const dataset = e.currentTarget.dataset
        const current = dataset.current;
        this.data.uploadImgs.splice(current, 1);
        this.setData({
            uploadImgs: this.data.uploadImgs
        })
    },
    //上传项目图片
    didPressChooesImage () {
        var that = this;
        didPressChooesImage(that);
    },
    /**
     * 提交表单
     * @param e
     * @returns {boolean}
     */
    submitForm(e) {
        const formParms = e.detail.value;
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            $toast.show({
                timer: 2e3,
                text: `${error.msg}`,
            });
            return false
        }
        let params = Object.assign({},formParms,{openid:app.globalData.wxData.open_id});
        api.addPlot(params).then(res => {

            let data = res.data;
            if (data.status == 'success') {

            } else {
                $toast.show({
                    timer: 2e3,
                    text: data.msg,
                });
            }
        });
    },
});

