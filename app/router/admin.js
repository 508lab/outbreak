/**
 * 管理员后台中心
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/admin/index', controller.admin.index.index);
    router.put('/admin/student/cpass', controller.admin.index.userpass);
    router.get('/admin/index/bardata', controller.admin.index.bardata);
    router.get('/admin/index/wuhandata', controller.admin.index.wuhandata);
    router.get('/admin/search', controller.admin.index.search);
    router.get('/admin/login', controller.admin.index.login);
    router.post('/admin/login', controller.admin.index.loginin);
    router.get('/admin/loginout', controller.admin.index.loginout);
    router.get('/admin/clas', controller.admin.index.clas);
    router.get('/admin/clasdata', controller.admin.index.clasdata);
    router.get('/admin/user/index', controller.admin.users.index);
    router.post('/admin/user/password', controller.admin.users.password);
    router.get('/admin/user/teacher', controller.admin.teacher.index);
    router.get('/admin/user/teacher/info', controller.admin.teacher.info);
    router.put('/admin/user/teacher/cpass', controller.admin.teacher.userpass);
};

