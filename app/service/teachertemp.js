const Service = require('egg').Service;
const TABLE = "teachertemp";

class TemperatureService extends Service {

    async insert(data) {
        const result = await this.app.mysql.insert(TABLE, data);
        return result;
    }

    async findNow(id) {
        const sql = `SELECT * FROM ${TABLE} WHERE date(time) = curdate() and sid = ${id};`;
        const result = await this.app.mysql.query(sql);
        return result[0];
    }

    /**
     * 根据id获取全部时间
     * @param {*} id 
     */
    async data(id) {
        const sql = `select record, date_format( time, '%Y-%m-%d' ) as time from ${TABLE} where sid = ${id} order by time desc`;
        return await this.app.mysql.query(sql);
    }

    /**
     * 获取温度大于给定温度的数据
     * @param {*} record 温度 
     * @param {*} time 时间  day week month
     */
    async dataByRecord(record, time) {
        let t = 'date(t.time) = curdate()';
        if (time == 'month') {  //本月
            t = `DATE_FORMAT( t.time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )`;
        } else if (time == 'day') {  //当天
            t = 'date(t.time) = curdate()';
        } else if (time == 'week') {
            t = `YEARWEEK(date_format(t.time,'%Y-%m-%d')) = YEARWEEK(now())`;
        }
        const sql = `select * from ${TABLE} t join user u on t.sid = u.id AND t.record >= ${record} AND ${t};`;
        return await this.app.mysql.query(sql);
    }


    /**
     * 获取区间数据(根据系别)
     * @param {*} time 
     * @param {*} dep 
     */
    async bardataByDep(time, dep) {
        let sids = await this.sid({ department: dep });
        if (sids) {
            const sql = `SELECT ELT( INTERVAL( record, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0) ,
            '35.0-36.0',  '36.0-37.0', '37.0-38.0', '38.0-39.0', '39.0-40.0') AS 'interval',
            COUNT( * ) AS  'num'
            FROM temperature WHERE TIME >= '${time[0]}' AND TIME <= '${time[1]}'
            AND sid IN ( ${sids} ) 
            GROUP BY ELT( INTERVAL( record, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0) , 
            '35.0-36.0',  '36.0-37.0',  '37.0-38.0',  '38.0-39.0', '39.0-40.0')`;
            return await this.app.mysql.query(sql);
        } else {
            return [];
        }
    }

    /**
     * 根据时间和系别获取数据
     * @param {*} time 
     * @param {*} dep 
     */
    async historyByDepTime(time, dep) {
        const sql = `select * from teachertemp t join teacher u where t.time >= "${time[0]}" AND t.time <= "${time[1]}" AND u.department = "${dep}";`
        return await this.app.mysql.query(sql);
    }

    /**
     * 根据条件获取id
     */
    async sid(where) {
        const ids = await this.app.mysql.select('user', {
            where: where,
            columns: ["id"]
        });
        let sids = '';
        ids.map(function (e) {
            sids += `${e.id},`;
        });
        sids = sids.slice(0, sids.length - 1);
        return sids || '';
    }

    /**
     * 统计37.0以上的人数
     * @param {*} record 
     */
    async outstandard(record) {
        //当天统计
        const now_sql = `SELECT count(DISTINCT sid) FROM ${TABLE} WHERE date(time) = curdate() AND record >= ${record};`;
        //全部统计
        const all_sql = `SELECT count(DISTINCT sid) FROM ${TABLE} WHERE record >= ${record}`;
        let all = await this.app.mysql.query(all_sql);
        let now = await this.app.mysql.query(now_sql);
        return {
            all: all[0]['count(DISTINCT sid)'],
            now: now[0]['count(DISTINCT sid)']
        };
    }
}

module.exports = TemperatureService;



