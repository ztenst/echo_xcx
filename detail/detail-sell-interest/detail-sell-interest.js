var api = require('./../../common/api');
const DetailSellInterest = {
    //初始化
    initDetailSellInterest(params,price) {
        let that = this;
        that.setData({
            currentPrice:price
        });
        //初始化esfList
        api.getEsfList(params).then(res => {
            let data = res.data.data;
            data.list.forEach((item,index) =>{
                data.list[index].title = item.title.substr(0,8);
                data.list[index].jiage = parseInt(that.data.currentPrice-item.price)
            })
            that.setData({
                esfInterestList: data.list
            });
        });
    },
};
export default DetailSellInterest;