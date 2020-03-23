# school



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

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

### Test
```
$ ./bin/jmeter -n -t 文件路径1/疫情填报系统测试.jmx -l 文件路径2/html.csv -e -o 文件路径
$ 注：测试使用的技术为-> jmeter
```

使用到的技术
```
$ "node": ">=10.0.0"
$ "MariaDB": ">=10.0.38"
```

### 功能
- 后台管理
- 学生客户端
- 教师客户端
- 体温填报(统计)
- 学习资源(在线云盘)

### 测试帐号
- 学生->   学号： 1501373434  密码： 123456   链接：/login
- 教师->   工号： 123456      密码： 123456   链接：/teacher/login
- 后台->   帐号： admin       密码： 123456   链接：/admin/login

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
