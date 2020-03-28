/**
 * 一些公共的接口
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/api/v1/vis/index', controller.vis.public.index);
    router.get('/api/v1/vis/bardata', controller.vis.public.bardata);
};