# outbreak



## QuickStart

<!-- add docs here for user -->

see [视频演示][https://508lab.github.io/2020/02/18/xi-tong/xue-sheng-ti-wen-xin-xi-xi-tong/]

### Development

```bash
$ 导入数据库 mtest.sql
$ 修改/config/config.default.js 中关于数据库的配置（config.mysql）
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### 使用到的技术
```bash
$ "node": ">=10.0.0"
$ "MariaDB": ">=10.0.38"
```

### 测试帐号
```bash
学生->   学号： 1501373434  密码： 123456
教师->   工号： 123456      密码： 123456
后台->   帐号： admin       密码： 123456  
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
