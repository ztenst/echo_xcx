let app = getApp();

Page({
    data: {},
    onLoad() {
        let self = this;
        self.setData({
            "userInfo": app.globalData.userInfo
        });
    },
    goToList(e) {
        let dataset = e.currentTarget.dataset, url = '', UID = app.globalData.userInfo.id;
        if (dataset.type == 'collect') {
            url = '/pages/collection_list/collection_list';
            app.goPage(url, {uid: UID}, false);
        } else if (dataset.type == 'baobei') {
            url = '/pages/baobei_list/baobei_list';
            app.goPage(url, {uid: UID}, false);
        }
    }

});
