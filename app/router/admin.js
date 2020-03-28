/**
 * 管理员后台中心
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/admin/index', controller.admin.index.index);
    router.get('/admin/login', controller.admin.index.login);
    router.post('/admin/login', controller.admin.index.loginin);
    router.get('/admin/loginout', controller.admin.index.loginout);

    router.get('/admin/user/index', controller.admin.users.index);
    router.get('/admin/user/teacher', controller.admin.teacher.index);
    router.get('/admin/user/teacher/info', controller.admin.teacher.info);
    router.put('/admin/user/teacher/cpass', controller.admin.teacher.userpass);
};

