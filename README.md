# school



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
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
$ 也可以直接查看 /app/public/test 下的文件
$ 注：测试使用的技术为-> jmeter
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org