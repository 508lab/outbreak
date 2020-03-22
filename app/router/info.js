/**
 * 学生
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/login', controller.home.login);
    router.post('/loginin', controller.home.loginin);
    router.get('/loginout', controller.home.loginout);
    router.get('/register', controller.home.register);
    router.get('/entry', controller.home.entry);
    router.post('/entry', controller.home.entrydata);

    /**
     * 个人中心
    */
    router.get('/info/index', controller.student.index.index);
    router.get('/info/user', controller.student.index.user);
    router.get('/info/temperature', controller.student.index.temperature);
    router.post('/info/temperature', controller.student.index.temp);
    router.get('/info/password', controller.student.index.password);
    router.post('/info/password', controller.student.index.cpass);
    router.put('/info/user/travel', controller.student.index.travel);
    router.get('/info/mirror', controller.student.index.mirror);
};