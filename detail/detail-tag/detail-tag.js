var api = require('./../../common/api');
const DetailTag = {
    //初始化
    initDetailTag(cate) {
        let that =this;
        api.getDetailTag(cate).then(res => {
            let data = res.data.data;
            that.setData({
                tsArr:data.list
            })
        });
    },
};
export default DetailTag;