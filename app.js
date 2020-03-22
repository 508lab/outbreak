// app.js
module.exports = app => {
    // 对静态资源验证
    app.config.coreMiddleware.unshift('mirror');
};