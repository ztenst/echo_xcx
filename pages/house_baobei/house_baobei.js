import {$calendar, $actionSheet, $toast} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {
        time: '',
        notice:'',
        start: '',
        end: '',
        changeShowPhone:true
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({title: '快速报备'});//设置导航条标题
        var self = this;
        /**
         * 新房详细页接口
         */
        api.getMplotDetail(options.id).then(res => {
            let data = res.data.data;
            if (res.data.status === 'success') {
                self.setData({plotdetail: data});
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 1000,
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000);
            }
        });
    },

    getPhone(e) {
        let that = this;
        that.setData({
            phone: e.detail.value
        });
    },
    getName(e) {
        let that = this;
        that.setData({
            name: e.detail.value
        });
    },
    three(e){
        let that = this;
        that.setData({
            three: e.detail.value
        });
    },
    four(e){
        let that = this;
        that.setData({
            four: e.detail.value
        });
    },
    sexRadioChange(e) {
        let that = this;
        that.setData({
            sex: e.detail.value
        });
    },
    visitRadioChange(e) {
        let that = this;
        that.setData({
            visit_way: e.detail.value
        });
    },
    switchPhoneChange(e){
        let that = this;
        that.setData({
            changeShowPhone: e.detail.value
        });
    },

    tapMarking() {
        let self = this;
        $actionSheet.show('fenxiao', {
            titleText: '选择市场对接',
            hid: self.data.plotdetail.id,
            list: self.data.plotdetail.phones,
            buttonClicked(index, item) {
                return true
            },
            onActionSheetClick(type, params) {
                self.setData({
                    notice:params.phone
                })
            }
        })
    },
    openCalendar() {
        console.log(this.time)
        if (this.time) {
            return this.time.show()
        }
        this.time = $calendar.init('birthday', {
            value: ['2017-04-15'],
            onChange(p, v, d) {
                console.log(p, v, d)
                this.setData({
                    time: d.join(', ')
                })
            }
        })
    },
    baoBei(e) {
        let self = this,
            fObj = e.detail.value;
        if (!self.data.time) {
            $toast.show({
                timer: 2e3,
                text: '请选择预计带看时间',
            });
            return false;
        }
        if (!self.data.notice) {
            $toast.show({
                timer: 2e3,
                text: '请选择市场对接',
            });
            return false;
        }
        if (!fObj.name) {
            $toast.show({
                timer: 2e3,
                text: '请输入客户姓名',
            });
            return false;
        }
        if (!self.data.three&&!self.data.changeShowPhone) {
            fObj.phone = '';
            $toast.show({
                timer: 2e3,
                text: '请输入前三位手机号',
            });
            return false;
        }
        if (!self.data.four&&!self.data.changeShowPhone) {
            fObj.phone = '';
            $toast.show({
                timer: 2e3,
                text: '请输入后四位手机号',
            });
            return false;
        }
        if (!/^\d{11}$/.test(fObj.phone)&&!self.data.changeShowPhone) {
            $toast.show({
                timer: 2e3,
                text: '手机号错误',
            });
            return false;
        }
        if (!self.data.sex) {
            $toast.show({
                timer: 2e3,
                text: '请选择性别',
            });
            return false;
        }
        if (!self.data.visit_way) {
            $toast.show({
                timer: 2e3,
                text: '请选择来访方式',
            });
            return false;
        }

        const pack = {
            hid: self.data.plotdetail.id,
            uid: app.globalData.userInfo.id,
            time: self.data.time,
            notice: self.data.notice,
            phone: fObj.phone?fObj.phone:self.data.three+"****"+self.data.four,
            name: fObj.name,
            sex: self.data.sex,
            visit_way: self.data.visit_way,
        }

        api.baiBei(pack).then((res) => {
            let data = res.data;
            $toast.show({
                timer: 2e3,
                text: data.msg,
            });
            if (data.status == 'success') {

            }
        })
    }

});
