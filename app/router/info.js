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
    router.get('/info/index', controller.user.index);
    router.get('/info/user', controller.user.user);
    router.get('/info/temperature', controller.user.temperature);
    router.post('/info/temperature', controller.user.temp);
    router.get('/info/password', controller.user.password);
    router.post('/info/password', controller.user.cpass);
    router.put('/info/user/travel', controller.user.travel);
};