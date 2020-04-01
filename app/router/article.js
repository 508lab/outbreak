/**
 * 一些公共的接口
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/article/list', controller.article.index.index);
    router.get('/article/list/data', controller.article.index.data);
};