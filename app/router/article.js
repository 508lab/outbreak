/**
 * 一些公共的接口
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/article/list', controller.article.index.index);
    router.get('/article/list/data', controller.article.index.data);
    router.get('/article/info', controller.article.index.find);
    router.get('/article/articletags', controller.article.index.articletags);
    router.post('/article/comment', controller.article.index.comment);
};