'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  require('./router/info')(app);
  require('./router/admin')(app);
  require('./router/teacher')(app);
  require('./router/vis')(app);
  require('./router/mirror')(app);
  require('./router/article')(app);

  router.get('/classaerch', controller.home.classaerch);
  router.get('/clasdepartment', controller.home.clasdepartment);
};
