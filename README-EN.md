# school

### Development

```deve
$ import database outbreak.sql (file in mariadb directory)
$ change in /config/config.default.js about database config（config.mysql）
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### deploy

```bash
$ npm start
$ npm stop
```

### Test
```
$ ./bin/jmeter -n -t path/test.jmx -l path2/html.csv -e -o file path
$ ps：Test technology is jmeter
$ Testing of Software will be slower,bacause i have something important  about work to handle.
```

technology use
```
$ "node": ">=10.10.0"
$ "MariaDB": ">=10.0.38"
```

### function
- admin management
    + teacher management
    + department management
    + email management
    + article label management
- teacher management
    + record temperatrue
    + studnet management 
    + Learning materials management
    + article  management(audit)
    + comments management(delete)
- studnet client
    + record temperatrue
    + download learning materials 
    + submit article
    + comments function to article
- other
    + search temperature
- To be continued(Welcome PR)
- If you nedd new function, you can submit issues.

### Test Id
- studnet
    - id： 1501373434  
    - password： 123456   
    - [link](http://uname.dongkji.com/login)
- teacher   
    - id： 123456      
    - password： 123456   
    - [link](http://uname.dongkji.com/teacher/login)
- background
    - name： admin       
    - password： 123456   
    - [link](http://uname.dongkji.com/admin/login)

### Docker start
```bash
$ You will package.json in scripts下start中的 --daemon 去掉
$ docker-compose up -d
$ open http://localhost:7001/
```


### Problem
- Many times, data of studnets need to be imported at one time.  [ref](https://github.com/508lab/AutoScript/tree/master/outbreak-dump) 
- If you have problem, you can send email to 2833324528@qq.com

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

### License
use [MIT](./LICENSE)

[egg]: https://eggjs.org
