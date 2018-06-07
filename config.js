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
    development: 'http://zt.jj58.com.cn',
    production: 'https://zt.jj58.com.cn'
};
// static path
var static_path = '';
module.exports = {
    env: env,
    version: version,
    static_path: static_path,
    host: hosts[env]
};