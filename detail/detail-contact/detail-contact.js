var api = require('./../../common/api');
const DetailContact = {
    //初始化
    initDetailContact(data) {
        let that =this;
        that.setData({showScodeimg:false});
        if(data.source == '中介'){
            api.staff(data.uid).then(res => {
                let d = res.data.data;
                if(d.length!==0){
                    that.setData({
                        contactData:d
                    })
                }
            });
        }else{
            if(data.username){
                data.name = data.username;
            }
            that.setData({
                contactData:data
            })
        }

    },
    calltel: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel
        })
    },
    weichat:function () {
        let that = this;
        that.setData({
            showScodeimg:!that.data.showScodeimg
        })
    },
    Scodeimg:function () {
        let that = this;
        that.setData({
            showScodeimg:!that.data.showScodeimg
        })
    },
    //查看二维码
    showScode:function(e){
        wx.previewImage({ urls: [e.currentTarget.dataset.current] })
    },
};
export default DetailContact;