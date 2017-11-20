
let app = getApp();

Page({
    data: {

    },
    onLoad(query) {

    },
    goToList(e){
        let self=this,dataset = e.currentTarget.dataset,url='';
        console.log(dataset)
        if(dataset.type == 'collect'){
            url = '/pages/collection_list/collection_list';
            app.goPage(url, null, false);
        }else if(dataset.type=='baobei') {
            url = "/pages/baobei_list/baobei_list";
            app.goPage(url, null, false);
        }
    }

});