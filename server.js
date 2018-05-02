/**
 * Created by apple on 2018/3/30.
 */
var express = require('express');
var bodyParser = require('body-parser');//引入
var cookieParser = require('cookie-parser'); //cookie操作中间件
var mysql  = require('mysql');
var superagent = require('superagent');
//var path = require('path');
//var fs = require('fs');

var app = express();

// 设置路径
//app.use('/static',express.static(path.join(__dirname, './')));

// bodyParser.urlencoded解析form表单提交的数据
app.use(bodyParser.urlencoded({extended: false}));

// bodyParser.json解析json数据格式的
app.use(bodyParser.json());

//cookie设置
app.use(cookieParser());

//设置静态文件路径
app.use(express.static('src'));


//app.use(function (req, res, next) {
//    res.set('Content-Type', 'application/x-javascript');
//    next();
//});

//填写数据库连接信息，可查询数据库详情页
var username = 'root';//用户AK
var password = '123456';//用户SK
var db_host = '127.0.0.1';
var db_port = 3306;
var db_name = 'hospitalSystem';
var option = {
    host: db_host,
    port: db_port,
    user: username,
    password: password,
    database: db_name,
    dateStrings:true
};
var connection = mysql.createConnection(option);
connection.connect();//连接数据库

app.get('/',function (req, res) {
    res.sendfile(__dirname + '/src/' + 'entry.html');
});

//app.get('/hospital',function (req, res) {
//    res.sendfile(__dirname + '/src/' + 'html/hospital.html');
//});
//
//app.get('/appointment',function (req, res) {
//    res.sendfile(__dirname + '/src/' + 'html/appointment.html');
//});

/**
 * @type action start
 */

//app.post('/test',function (req,res){
//    //var result = null;
//    superagent
//        .get('https://weixin.guizhou12320.org.cn/gzappv2/index.php/Index/getArticleList')
//        .send({
//            catid: '8',
//            pagenum: '1',
//            mode: 'knowledge'
//        })
//        .set({
//            'Content-Type': 'application/x-www-form-urlencoded',
//            'Cookie': 'PHPSESSID=lceddnscvj2qmk2jt7qbh4t537'
//        })
//        .accept('application/json')
//        .end(function(err, response) {
//            if (err) {
//                //do something
//                console.log('请求失败!');
//                console.log(err);
//            } else {
//                //do something
//                console.log('请求成功!');
//                //console.log(res);
//                console.log(JSON.parse(response.text));
//                //res.send(JSON.parse(response.text));
//            }
//        });
//
//});

//app.post('/test', function (req, res) {
//    //res.send('Hello World');
//    console.log("请求的单词数量"+req.body.thereAreNumber);
//    console.log("请求的词库为"+req.body.cardState+"0->四级，1->六级");
//    if (req.body.cardState == 0){whichCard = "CET4Word"};
//    if (req.body.cardState == 1){whichCard = "CET6Word"};
//    console.log(whichCard);
//    var DateSql = "SELECT * FROM " + whichCard + " WHERE ifknow=1 order by rand() limit " + req.body.thereAreNumber ;
//    connection.query(DateSql, function (err, result) {
//        if (err) {
//            console.log('[SELECT ERROR] - ', err.message);
//            return;
//        }
//        //console.log(result);
//        res.send(result);
//    });
//});

//注册患者
app.post('/registerPatient',function(req,res){
    console.log(req.body) ;
    var DateSql = "INSERT INTO patient_login ( id, name, gender, password, birthday, telephone ) VALUES ( "+ req.body.p_id +", '"+ req.body.p_name+"','"+ req.body.p_gender+"','"+ req.body.p_password+"','"+ req.body.p_birthday+"','"+ req.body.p_telephone+"');";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
               code:500,
               msg:'注册失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'注册成功'
        });
    });
});

//注册医生
app.post('/registerDoctor',function(req,res){
    console.log(req.body) ;
    var DateSql = "INSERT INTO doctor_login ( id, name, gender, password, department, telephone ) VALUES ( "+ req.body.d_id +", '"+ req.body.d_name+"','"+ req.body.d_gender+"','"+ req.body.d_password+"','"+ req.body.d_department+"','"+ req.body.d_telephone+"');";
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'注册失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'注册成功'
        });
    });
});

//忘记密码
app.post('/getBackpassword',function(req,res){
    var identity = {
        '患者':'patient_login',
        '医生':'doctor_login'
    },
        randompassword = (Math.random() * 1000000).toFixed(0);

    console.log(req.body) ;
    var DateSql = "UPDATE " + identity[req.body.f_identity] + " SET password='" + randompassword + "' WHERE  id='"+ req.body.f_id +"' AND telephone='" + req.body.f_telephone + "';";
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            password:randompassword
        });
    });
});

//登录
app.post('/login',function(req,res){
    var identity = {
            '患者':'patient_login',
            '医生':'doctor_login'
        };
    console.log(req.body) ;
    var DateSql = "SELECT * FROM " + identity[req.body.identity] + " WHERE id=" + req.body.id + ";";
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }

        if (result[0] && result[0].password == req.body.password){
            res.send({
                code:200,
                msg:'登录成功',
                client:result[0]
            });
        } else {
            res.send({
                code:501,
                msg:'账号或密码错误!'
            });
        }
    });
});

//推荐医生
app.post('/recommendDoctor', function (req,res) {
    console.log(req.body) ;
    var DateSql = "select id,name,gender,telephone,department,intro from `doctor_login` order by rand() limit 3;";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

//根据日期查询有号源的医生
app.post('/getDoctorlist', function (req,res) {
    console.log(req.body) ;

    var DateSql = "select  al.`doctorid`, dl.`name`, count(al.`id`) as num " +
        "from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id` " +
        "where al.`date` = '" + req.body.date + "' and al.`department` = '" + req.body.department + "' and al.`status` = '未完成' " +
        "group by dl.`name`, al.`doctorid`;";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

app.post('/getCurrentAppointment', function (req, res) {
    console.log(req.body) ;

    var DateSql = " select al.`id`,al.`time`,al.`address` from `appointment_list` al where al.`doctorid` = "  + req.body.doctorid + " and al.`date` = '"  + req.body.date + "' ";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

app.post('/getDoctorinfo', function (req,res) {
    console.log(req.body) ;

    var DateSql = "select  al.`doctorid`, dl.`name`, count(al.`id`) as num , dl.`department`,dl.`intro`" +
        "from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id`" +
        "where al.`date` = '" + req.body.date + "' and al.`status` = '未完成' and al.`doctorid` = " + req.body.doctorid  +
        " group by dl.`name`, al.`doctorid`;";

    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

/** ******************************************************************* 医生端  **************************************************************************** **/

//新增预约挂号
app.post('/addappointment',function(req,res){
    console.log(req.body) ;
    var valstr = "",num = +req.body.number;
    for (var i = 0 ; i < num ; i++){
        if (i == num - 1 ){
            valstr += "(" + req.body.doctorid + (Math.random() * 1000000).toFixed(0) + "," + req.body.doctorid + ",'" + req.body.date + "','" + req.body.time + "','" + req.body.address + "','" + req.body.department + "','未完成');";
        } else {
            valstr += "(" + req.body.doctorid + (Math.random() * 1000000).toFixed(0) + "," + req.body.doctorid + ",'" + req.body.date + "','" + req.body.time + "','" + req.body.address + "','" + req.body.department + "','未完成'),";
        }
    }

    var DateSql = "INSERT INTO appointment_list ( id, doctorid, date, time, address,department,status ) VALUES " + valstr;
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'操作成功'
        });
    });
});

//查询日历
app.post('/getCalendar',function(req,res){
    console.log(req.body) ;
    //var DateSql = "Select distinct(date) from `appointment_list` where doctorid = " + req.body.doctorid;

    var DateSql = "Select distinct(ol.`date`) from `appointment_list` ol where ol.doctorid = " + req.body.doctorid + " and ol.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') order by ol.`date` asc";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

//查询预约列表
app.post('/getAppointment', function (req,res) {
    console.log(req.body) ;
    var DateSql = " select ol.`id`, ol.`doctorid`, ol.`patientid`, pl.`name`,ol.`time`, ol.`date` ,ol.`address`, ol.`status` " +
        "from appointment_list ol left join patient_login pl on ol.`patientid` = pl.`id`  " +
        "where ol.`doctorid` = " + req.body.doctorid + " and ol.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and ol.`status` = '未完成' order by ol.`date` asc ";
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

//完成预约
app.post('/complateAppointment', function (req,res) {
    console.log(req.body) ;
    var DateSql = "UPDATE appointment_list SET status = '已完成' WHERE id = " + req.body.id;
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功'
        });
    });
});

//取消预约
app.post('/cancelAppointment', function (req,res) {
    console.log(req.body) ;
    var DateSql = "UPDATE appointment_list SET status = '已取消' WHERE id = " + req.body.id;
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'操作失败!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'操作成功'
        });
    });
});

//更新医生个人简介
app.post('/editintro', function (req,res) {
    console.log(req.body) ;
    var DateSql = "UPDATE doctor_login SET intro = '" + req.body.intro + "' WHERE id = " + req.body.doctorid;
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'更新失败!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'更新成功'
        });
    });
});

//查询当前日期下的医生订单
app.post('/getDateList', function (req,res) {
    console.log(req.body) ;
    var DateSql = "select ol.`id`, ol.`doctorid`, ol.`patientid`, pl.`name`,pl.`telephone`,ol.`time`, ol.`date` ,ol.`address`, ol.`status` from appointment_list ol left join patient_login pl on ol.`patientid` = pl.`id`  where  ol.`doctorid` = " + req.body.doctorid + " and ol.`date` = '" + req.body.date + "' ";
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'查询失败!'
            });
            return;
        }
        console.log(result);
        res.send({
            code:200,
            msg:'查询成功',
            result:result
        });
    });
});

/**
 * @type action end
 */
var server = app.listen(9999, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("访问地址为 http://localhost:9999");

});


/*
 * 批量生成订单脚本
 */

//function insert() {
//    var doctorSql = 'select id,department from doctor_login';
//    var doctoridArr = [];
//    var departmentArr = [];
//    connection.query(doctorSql, function (err, result) {
//        if (result) {
//           // console.log(result);
//            result.forEach(function (item) {
//                doctoridArr.push(item.id);
//                departmentArr.push(item.department);
//            });
//            ss(doctoridArr,departmentArr);
//
//        }
//
//    });
//
//
//
//}
//function ss (doctoridArr,departmentArr){
//    //var times = +new Date();
//    var dateArr = ['2018-5-2','2018-5-3','2018-5-4','2018-5-5','2018-5-6','2018-5-7',
//        '2018-5-8','2018-5-9','2018-5-10','2018-5-11','2018-5-12','2018-5-13','2018-5-14','2018-5-15','2018-5-16','2018-5-17','2018-5-18',
//        '2018-5-19','2018-5-20','2018-5-21','2018-5-22','2018-5-23','2018-5-24','2018-5-25','2018-5-26','2018-5-27'];
//    var room = ['101','102','103'];
//    for(var i = 0 ; i < 500 ; i++ ) {
//        var ra = Math.floor(Math.random() * (doctoridArr.length));
//
//        //var id = times + i;
//        var doctorid = +doctoridArr[ra];
//        var id = doctorid + (Math.random() * 1000000).toFixed(0);
//        //console.log("doctorid",doctorid)
//        var date = dateArr[Math.floor(Math.random() * dateArr.length)];
//        var time = '8:00 ~ 9:00';
//        var address = departmentArr[ra] + room[Math.floor(Math.random() * 3)];
//        var department = departmentArr[ra];
//        var status = '未完成';
//        var sql = "insert into appointment_list (id,doctorid,date,time,address,department,status) values (" + id + "," + doctorid + ",'" + date + "','" + time + "','" + address + "','" + department + "','" + status + "')";
//        //console.log(sql);
//        connection.query(sql,function(err,rs){
//            if (err) {
//                console.log('error');
//                return;
//            }
//        });
//    }
//}
//
//insert();