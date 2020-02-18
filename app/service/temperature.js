const Service = require('egg').Service;
const TABLE = "temperature";

class TemperatureService extends Service {
    
    async insert(data){
        const result = await this.app.mysql.insert(TABLE, data);
        return result;
    }

    async findNow(id){
        const sql = `SELECT * FROM ${TABLE} WHERE date(time) = curdate() and sid = ${id};`;
        const result = await this.app.mysql.query(sql);
        return result[0];
    }

    /**
     * 根据id获取全部时间
     * @param {*} id 
     */
    async data(id){
        const sql = `select record, date_format( time, '%Y-%m-%d' ) as time from ${TABLE} where sid = ${id} order by time desc`;
        const result = await this.app.mysql.query(sql);
        return result;
    }

    /**
     * 获取温度大于给定温度的数据
     * @param {*} record 温度 
     * @param {*} time 时间  day week month
     */
    async dataByRecord(record, time){
        let t = 'date(t.time) = curdate()';
        if (time == 'month') {  //本月
            t = `DATE_FORMAT( t.time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )`;
        }else if(time == 'day'){  //当天
            t = 'date(t.time) = curdate()';
        }else if (time == 'week') {
            t = `YEARWEEK(date_format(t.time,'%Y-%m-%d')) = YEARWEEK(now())`;
        }
        const sql = `select * from ${TABLE} t join user u on t.sid = u.id AND t.record >= ${record} AND ${t};`;
        return await this.app.mysql.query(sql);
    }
}

module.exports = TemperatureService;



