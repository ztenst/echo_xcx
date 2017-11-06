var app = getApp();
/**
 * 小程序配置文件
 */
'use strict';
// ENV
var env = 'production'; // 'development' or 'production'
// hj_house_xcx VERSION
var version = '1.0.3';
// development and production host
var template_id = "JOXLVwxCJy2S3vsPZCXtPXSypo-W9gHhounXsqFSN5Y";
var hosts = {
    development: 'https://house.hangjiayun.com',
    production: 'https://housexcx.hualongxiang.com'
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