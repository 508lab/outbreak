'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
