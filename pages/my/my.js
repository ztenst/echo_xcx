import api from '../../common/api'

let app = getApp();

Page({
    data: {},
    onShow() {
        let self = this;

        app.getUserOpenId().then(res => {
            self.setData({
                customInfo: app.globalData.customInfo,
                userInfo: app.globalData.userInfo,
            });
        });
    },
    goToList(e) {
        let dataset = e.currentTarget.dataset, url = '', UID = app.globalData.customInfo.id;
        if (!app.globalData.isTrue) {
            let url = '/pages/add_message/add_message';
            app.goPage(url, null, false);
        } else {
            if (dataset.type == 'collect') {
                url = '/pages/collection_list/collection_list';

            } else if (dataset.type == 'baobei') {
                url = '/pages/baobei_list/baobei_list';
            }
            app.goPage(url, {uid: UID}, false);
        }
    },
    getPhone() {
        api.getPhone().then(res => {
            wx.makePhoneCall({
                phoneNumber: res.data.data
            });
        });
    },
    fabuHouse() {
        let url = '/pages/myhouse_list/myhouse_list';
        app.goPage(url, {uid: 1}, false);
    }

});
