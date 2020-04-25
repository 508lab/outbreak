const Tool = require('../global/tool');

module.exports = {
    /**
     * 查询Email功能是否开启
     */
    async emailStatus() {
        let conf = await Tool.getEmailConf();
        return conf.status == '1';
    },
  };