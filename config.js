var app = getApp();
/**
 * 小程序配置文件
 */
'use strict';
// ENV
var env = 'production'; // 'development' or 'production'
// hj_house_xcx VERSION
var version = '1.0.1';
// development and production host
var hosts = {
<<<<<<< HEAD
    development: 'http://zt.jj58.com.cn',
    production: 'http://zt.jj58.com.cn'
=======
    development: 'http://house.jj58.com.cn',
    production: 'https://house.jj58.com.cn'
>>>>>>> bdf483964f412a1ec1ef04bdba86580c9e83f70a
};
// static path
var static_path = '';
module.exports = {
    env: env,
    version: version,
    static_path: static_path,
    host: hosts[env]
};