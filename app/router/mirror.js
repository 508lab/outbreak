/**
 * 一些公共的接口
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/api/v1/mirror/index', controller.mirror.index.index);
    router.get('/api/v1/mirror/download', controller.mirror.index.download);
    router.post('/api/v1/mirror/upload', controller.mirror.index.upload);
    router.post('/api/v1/mirror/upload/continuingly', controller.mirror.index.continuingly);
    router.post('/api/v1/mirror/mkdir', controller.mirror.index.mkdir);
    router.delete('/api/v1/mirror/delete', controller.mirror.index.delete);
    router.put('/api/v1/mirror/update', controller.mirror.index.update);
    router.post('/api/v1/mirror/search', controller.mirror.index.search);
};