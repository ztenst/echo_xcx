import {$calendar, $actionSheet, $toast} from '../../components/wxcomponents'
import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {
        time: '',
        notice: '',
        start: '',
        end: '',
        changeShowPhone: true,
        sexItems: [
            {name: '先生', value: 1, checked: 'true'},
            {name: '女士', value: 2},
        ],
        visitItems: [
            {name: '自驾', value: 1, checked: 'true'},
            {name: '班车', value: 2},
        ]
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({title: '快速报备'});//设置导航条标题
        var self = this;
        let plot_id = options.id;
        self.setData({plot_id: plot_id});
    },

    onShow: function () {
        let self = this;
        let plot_id = self.data.plot_id;
        let uid = app.globalData.customInfo.id;
        self.getMplotDetail(plot_id,uid);
    },

    getMplotDetail(plot_id,uid){
        let self =this;
        /**
         * 新房详细页接口
         */
        api.getMplotDetail({
            id: plot_id,
            uid: uid
        }).then(res => {
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
    /**
     * 获取用户手机号
     * @param e
     */
    getPhone(e) {
        let that = this;
        that.setData({
            phone: e.detail.value
        });
    },
    /**
     * 获取用户姓名
     * @param e
     */
    getName(e) {
        let that = this;
        that.setData({
            name: e.detail.value
        });
    },
    three(e) {
        let that = this;
        that.setData({
            three: e.detail.value
        });
    },
    four(e) {
        let that = this;
        that.setData({
            four: e.detail.value
        });
    },
    /**
     *设置性别
     * @param e
     */
    sexRadioChange(e) {
        let that = this;
        that.setData({
            sex: e.detail.value
        });
    },
    /**
     * 设置来访方式
     * @param e
     */
    visitRadioChange(e) {
        let that = this;
        that.setData({
            visit_way: e.detail.value
        });
    },
    /**
     * 切换输入的手机号格式
     * @param e
     */
    switchPhoneChange(e) {
        let that = this;
        that.setData({
            changeShowPhone: e.detail.value
        });
    },
    /**
     * 选择市场对接时间
     * @returns {boolean}
     */
    tapMarking() {
        let self = this;
        $actionSheet.show('market', {
            titleText: '选择市场对接',
            hid: self.data.plotdetail.id,
            list: self.data.plotdetail.phones,
            onActionSheetClick(type, params) {
                self.setData({
                    notice: params.phone
                })
            }
        })
    },
    /**
     * 设置预计带看时间
     * @returns {*|void}
     */
    openCalendar() {
        if (this.time) {
            return this.time.show()
        }
        let now = new Date();
        var init = Util.formatTime(now,"yyyy-MM-dd");
        this.time = $calendar.init('start', {
            value: [init],
            onChange(p, v, d) {
                this.setData({
                    time:d
                });
            }
        });
    },
    /**
     * 报备的表单提交
     * @param e
     * @returns {boolean}
     */
    baoBei(e) {
        let self = this, fObj = e.detail.value;
         console.log(fObj,self.data.changeShowPhone)
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
        if (!fObj.three && self.data.changeShowPhone) {
            fObj.phone = '';
            $toast.show({
                timer: 2e3,
                text: '请输入前三位手机号',
            });
            return false;
        }
        if (!fObj.four && self.data.changeShowPhone) {
            fObj.phone = '';
            $toast.show({
                timer: 2e3,
                text: '请输入后四位手机号',
            });
            return false;
        }
        if (!/^\d{11}$/.test(fObj.phone) && !self.data.changeShowPhone) {
            $toast.show({
                timer: 2e3,
                text: '手机号错误',
            });
            return false;
        }
        if (fObj.sex != 1 && fObj.sex != 2) {
            $toast.show({
                timer: 2e3,
                text: '请选择性别',
            });
            return false;
        }
        if (fObj.visit_way != 1 && fObj.visit_way != 2) {
            $toast.show({
                timer: 2e3,
                text: '请选择来访方式',
            });
            return false;
        }

        const pack = {
            hid: self.data.plotdetail.id,
            uid: app.globalData.customInfo.id,
            time: self.data.time,
            notice: self.data.notice,
            phone: fObj.phone ? fObj.phone : self.data.three + "****" + self.data.four,
            name: fObj.name,
            sex: self.data.sex,
            visit_way: self.data.visit_way,
        }

        api.baiBei(pack).then((res) => {
            let data = res.data;
            $toast.show({
                timer: 3e3,
                text: data.msg,
            });
            if (data.status == 'success') {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                },2e3)
            }
        })
    }

});
