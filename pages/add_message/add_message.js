import api from '../../common/api'
import Util from '../../utils/util'

let app = getApp();

Page({
    data: {

    },
    onLoad: function (options) {

    },

    goPage: function (e) {
        app.goPage(e.currentTarget.dataset.url, Util.query2Params(e.currentTarget.dataset.param), false)
    },

});
