import api from '../../common/api'

let app = getApp();

Page({
    data: {
        isExtendBox:true
    },
    onShow() {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    },
    goToList(e) {
        let dataset = e.currentTarget.dataset, url = '', UID = app.globalData.userInfo.id;
        if (!app.globalData.isTrue) {
            let url = '/pages/add_message/add_message';
            // wx.redirectTo({
            //   url: url,
            // })
            app.goPage(url, null, false);
        } else {
            if (dataset.type == 'collect') {
              url = '/pages/collection_list/collection_list';

            } else if (dataset.type == 'baobei') {
                url = '/pages/baobei_list/baobei_list';
            }
            // console.log(url);
            // wx.redirectTo({
            //   url: url
            // })
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
    GoTo(e) {
        let dataset = e.currentTarget.dataset, url = '';
        if (dataset.type=='member') {
            let url = '/pages/member/member';
            app.goPage(url, {}, false);
        } else {
            let url = '/pages/myhouse_list/myhouse_list';
            app.goPage(url, {}, false);
        }
    },
    xiala(e){
        this.setData({
            isExtendBox:!this.data.isExtendBox
        });
        console.log(this.data.isExtendBox)
    }

});
