var app = getApp();
/**
 * 小程序配置文件
 */
'use strict';
// ENV
var env = 'development'; // 'development' or 'production'
// hj_house_xcx VERSION
var version = '1.0.1';
// development and production host
var template_id = "JOXLVwxCJy2S3vsPZCXtPXSypo-W9gHhounXsqFSN5Y";
var hosts = {
    development: 'http://house.jj58.com.cn',
    production: ''
};
// static path
var static_path = 'http://s.hangjiayun.com/house/20170817114001/miniapp';
module.exports = {
    env: env,
    version: version,
    static_path: static_path,
    template_id: template_id,
    host: hosts[env]
};