'use strict';
const ErrMsg = require('../global/errmsg');
/**
 * sql异常处理
 */
module.exports = (option, app) => {
    return async function (ctx, next) {
        try {
            await next();
        } catch (err) {
            // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
            app.emit('error', err, this);
            getErrRes(err, ctx);
        }
    };
};

/**
 * 根据错误的code做不同的处理
 * @param {*} code 
 */
function getErrRes(err, ctx) {
    if (err.code === "ER_BAD_FIELD_ERROR" && err.sqlState === "42S22") { //无痕浏览器环境下直接获取session会报错
        ctx.redirect('/login');
    }
}