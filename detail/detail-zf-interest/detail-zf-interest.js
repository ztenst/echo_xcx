var api = require('./../../common/api');
const DetailZfInterest = {
    //初始化
    initDetailZfInterest(params,id) {
        let  that = this;
        api.getZfList(params).then(res => {
            let data = res.data.data;
            data.list.forEach((item,index) =>{
                data.list[index].title = item.title.substr(0,10);
            })
            that.setData({
                zfInterestList: data.list
            });
        });
    },
};
export default DetailZfInterest;