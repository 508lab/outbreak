/**
 * 教师
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/teacher/login', controller.teacher.index.login);
    router.post('/teacher/login', controller.teacher.index.login);
    router.get('/teacher/loginout', controller.teacher.index.loginout);
    //个人中心
    router.get('/teacher/index', controller.teacher.index.index);
    router.get('/teacher/user', controller.teacher.index.user);
    router.put('/teacher/user', controller.teacher.index.updateuser);
    router.get('/teacher/temperature', controller.teacher.index.temperature);
    router.post('/teacher/temperature', controller.teacher.index.temp);
    router.get('/teacher/password', controller.teacher.index.password);
    router.put('/teacher/password', controller.teacher.index.password);
};