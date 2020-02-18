'use strict';

/**
 * @param {Egg.Application} app - egg application
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


  /**
   * 后台中心
   */

  router.get('/admin/index', controller.admin.index);
  router.get('/admin/search', controller.admin.search);
  router.get('/admin/login', controller.admin.login);
  router.post('/admin/login', controller.admin.loginin);
  router.get('/admin/loginout', controller.admin.loginout);
  router.get('/admin/clas', controller.admin.clas);
  router.get('/admin/clasdata', controller.admin.clasdata);
  router.get('/admin/index/clasdepartment', controller.admin.clasdepartment)
};
