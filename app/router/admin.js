/**
 * 管理员后台中心
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/admin/index', controller.admin.index.index);
    router.get('/admin/login', controller.admin.index.login);
    router.post('/admin/login', controller.admin.index.loginin);
    router.get('/admin/loginout', controller.admin.index.loginout);
    router.get('/admin/clasdep', controller.admin.index.clasdep);
    router.get('/admin/user/index', controller.admin.users.index);

    //关于教师的router
    router.get('/admin/user/teacher', controller.admin.teacher.index);
    router.get('/admin/user/teacher/list', controller.admin.teacher.list);
    router.get('/admin/user/teacher/info', controller.admin.teacher.info);
    router.put('/admin/user/teacher/cpass', controller.admin.teacher.userpass);
    router.put('/admin/user/teacher/index', controller.admin.teacher.teacher);
    router.post('/admin/user/teacher/index', controller.admin.teacher.teacher);
    router.get('/admin/user/teacher/index', controller.admin.teacher.teacher);
    router.delete('/admin/user/teacher/index', controller.admin.teacher.teacher);
    
};

