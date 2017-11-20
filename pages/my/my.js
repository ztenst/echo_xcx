import api from '../../common/api'
let app = getApp();

Page({
    data: {},
    onLoad() {
        let self = this;

        app.getUserOpenId().then(res =>{
             if(!res.open_id){
                 self.setData({
                     "isUser": true,
                     "customInfo": res
                 });
             }
        });

        self.setData({
            "userInfo": app.globalData.userInfo,
        });

    },
    goToList(e) {
        let dataset = e.currentTarget.dataset, url = '', UID = app.globalData.customInfo.id;
        if (dataset.type == 'collect') {
            url = '/pages/collection_list/collection_list';
            app.goPage(url, {uid: UID}, false);
        } else if (dataset.type == 'baobei') {
            url = '/pages/baobei_list/baobei_list';
            app.goPage(url, {uid: UID}, false);
        }
    },
    getPhone(){
        api.getPhone().then(res => {
            wx.makePhoneCall({
                phoneNumber: res.data.data
            });
        });
    }

});
