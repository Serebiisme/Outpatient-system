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

//修改密码
app.post('/modifypassword', function (req,res) {
    console.log(req.body) ;

    var type = req.body.type == "1" ? "1" : "0",
        identity = {
        '0':'patient_login',
        '1':'doctor_login'
    };

    var DateSql = "UPDATE " + identity[type] + " SET password='" + req.body.newpsd + "' WHERE  id="+ req.body.id;

    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'修改失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'修改成功!'
        });
    });
});

//登录
app.post('/login',function(req,res){
    var identity = {
            '患者':'patient_login',
            '医生':'doctor_login',
            '管理员':'manager_login'
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
    var DateSql = " select dl.id,dl.name,dl.gender,dl.telephone,dl.department, dl.intro  " +
        "from `doctor_login` dl left join `appointment_list` al on al.`doctorid` = dl.`id` " +
        " where al.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` <= DATE_FORMAT(DATE_ADD(CURRENT_DATE(),INTERVAL 7 DAY),'%Y-%m-%d') " +
        "  order by rand() limit 3;";

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

//得到当前可预约信息
app.post('/getCurrentAppointment', function (req, res) {
    console.log(req.body) ;

    var DateSql = " select al.`id`,al.`time`,al.`address` from `appointment_list` al where al.`doctorid` = "  + req.body.doctorid + " and al.`date` = '"  + req.body.date + "' and status = '未完成'";

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

//获取医生信息
app.post('/getDoctorinfo', function (req,res) {
    console.log(req.body) ;

    //var DateSql = "select  al.`doctorid`, dl.`name`, count(al.`id`) as num , dl.`department`,dl.`intro`" +
    //    "from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id`" +
    //    "where al.`date` = '" + req.body.date + "' and al.`doctorid` = " + req.body.doctorid  +
    //    " group by dl.`name`, al.`doctorid`;";

    var DateSql = "select id,name,intro,department from `doctor_login` where id = " + req.body.doctorid;

    //console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        //console.log(result);

        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

//确认预约
app.post('/confirmAppointment', function (req,res) {
    console.log(req.body) ;

    var DateSql = " UPDATE `appointment_list` SET status = '已预约' , patientid = " + req.body.patientid + " where id = " + req.body.id;

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
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

//搜索医生
app.post('/searchDoctor',function(req,res){
    console.log(req.body);

    var DateSql = "Select distinct(al.`date`) , dl.`name` ,dl.`id`,dl.`intro`,dl.`department` " +
        " from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id`  " +
        " where dl.`name` = '" + req.body.keyval + "' and al.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` <= DATE_FORMAT(DATE_ADD(CURRENT_DATE(),INTERVAL 7 DAY),'%Y-%m-%d') " +
        " and al.`status` = '未完成'  order by al.`date` asc";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        console.log(result);

        var data = {};

        result.forEach(function (item) {
            if (data[item.id]){
                data[item.id].name = item.name;
                data[item.id].intro = item.intro;
                data[item.id].department = item.department;
                data[item.id].dates.push(item.date);
            } else {
                data[item.id] = {};
                data[item.id].name = item.name;
                data[item.id].intro = item.intro;
                data[item.id].department = item.department;
                data[item.id].dates ? data[item.id].dates.push(item.date) : (data[item.id].dates = [],data[item.id].dates.push(item.date));
            }
        });

        res.send({
            code:200,
            msg:'操作成功',
            data:data
        });
    });
});

//获取我的预约
app.post('/getMyAppointment', function (req,res) {
    console.log(req.body);

    var DateSql = "select al.`id`,al.`address`,al.`date`,al.`time`,dl.`name`  " +
        "from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id` " +
        " where al.`patientid` = " + req.body.patientid + " and al.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` <= DATE_FORMAT(DATE_ADD(CURRENT_DATE(),INTERVAL 7 DAY),'%Y-%m-%d') " +
        " and al.`status` = '已预约' order by al.`date` asc;";

    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'网络错误!'
            });
            return;
        }
        //console.log(result);

        res.send({
            code:200,
            msg:'操作成功',
            data:result
        });
    });
});

//取消我的预约
app.post('/cancelMyAppointment', function (req,res) {
    console.log(req.body) ;
    var DateSql = "UPDATE appointment_list SET status = '未完成' WHERE id = " + req.body.id;
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

//获取病历
app.post('/getHistroyAppointment', function (req,res) {
   console.log(req.body);

    var DateSql = "select al.`id`,al.`address`,al.`date`,al.`time`,dl.`name`,al.`result` " +
        " from `appointment_list` al left join `doctor_login` dl on al.`doctorid` = dl.`id` " +
        " where al.`patientid` = " + req.body.patientid + " and al.`date` <= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`status` = '已完成' " +
        " order by al.`date` desc";

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
            data:result
        });
    });
});

//获取医院信息
app.post('/getHospitalInfo', function (req,res) {
    console.log(req.body);
    var DateSql = 'select * from `hospital_info` where id = 1';
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
            data:result
        });
    });
});

//统计科室人员
app.post('/countDepartment', function (req,res) {
    console.log(req.body);
    var DateSql = 'select dl.`department` , count(dl.`id`) as num  from `doctor_login` dl group by dl.`department`';
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
        "where ol.`doctorid` = " + req.body.doctorid + " and ol.`date` >= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and ( ol.`status` = '未完成'  or ol.`status` = '已预约' ) order by ol.`date` asc ";
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
    var DateSql = "UPDATE appointment_list SET status = '已完成' ,result = ' " + req.body.result +"' WHERE id = " + req.body.id;
    console.log(DateSql);
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

/** ******************************************************************* 管理端  **************************************************************************** **/

//获取所有医生
app.post('/getAllDoctor', function (req,res) {
    var DateSql = 'select * from `doctor_login` order by `doctor_login`.`id` asc';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'查询失败!'
            });
            return;
        }
        res.send({
            code:200,
            msg:'查询成功',
            result:result
        });
    });
});

//更新医生
app.post('/updateDoctor',function(req,res){
    console.log(req.body) ;
    var DateSql = "update `doctor_login` set id = " + req.body.u_id + " ,name = '" + req.body.u_name + "',password = " + req.body.u_password + " , gender = '" + req.body.u_gender + "' , telephone = '" + req.body.u_telephone + "' ,department = '" + req.body.u_department + "' where id = " + req.body.u_id;
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'更新失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'更新成功'
        });
    });
});

//删除医生
app.post('/deleteDoctor',function(req,res){
    console.log(req.body) ;
    var DateSql = "delete `doctor_login`,`appointment_list` from `doctor_login` left join `appointment_list` on `doctor_login`.`id` = `appointment_list`.`doctorid` where `doctor_login`.`id` = " + req.body.id;
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'删除失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'删除成功'
        });
    });
});

//获取所有注册患者
app.post('/getAllPatient', function (req,res) {
    var DateSql = 'select * from `patient_login` order by `patient_login`.id asc';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'查询失败!'
            });
            return;
        }
        res.send({
            code:200,
            msg:'查询成功',
            result:result
        });
    });
});

//更新患者信息
app.post('/updatePatient',function(req,res){
    console.log(req.body) ;
    var DateSql = "update `patient_login` set id = " + req.body.p_id + " ,name = '" + req.body.p_name + "',password = " + req.body.p_password + " , gender = '" + req.body.p_gender + "' , telephone = '" + req.body.p_telephone + "' where id = " + req.body.p_id;
    console.log(DateSql);
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'更新失败!'
            });
            return;
        }
        //console.log(result);
        res.send({
            code:200,
            msg:'更新成功'
        });
    });
});

//获取科室列表
app.post('/getAllDepartment', function (req,res) {
    console.log(req.body);
    var DateSql = 'select * from `department_list` order by `department_list`.id asc';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'查询失败!'
            });
            return;
        }

        if  (req.body.type != 1){
            result = result.filter(function (item) {
                return item.ifshow != 0;
            });
        }

        res.send({
            code:200,
            msg:'查询成功',
            result:result
        });
    });
});

//添加科室
app.post('/addDepartment', function (req,res) {
    console.log(req.body);
    var DateSql = 'insert into `department_list` (department) values ("' + req.body.department + '")';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'添加失败!'
            });
            return;
        }
        res.send({
            code:200,
            msg:'添加成功'
        });
    });
});

//编辑科室
app.post('/editDepartment', function (req,res) {
    console.log(req.body);
    var DateSql = 'update `department_list` ol,`doctor_login` dl , `appointment_list` al ' +
        ' set ol.`department` = "' + req.body.newName  + '" , dl.`department` = "' + req.body.newName  + '", al.`department` = "' + req.body.newName  + '"  ' +
        'where ol.`department` = "' + req.body.oldName  + '" and dl.`department` = "' + req.body.oldName  + '" and al.`department` = "' + req.body.oldName  + '"';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'更新失败!'
            });
            return;
        }
        res.send({
            code:200,
            msg:'更新成功!'
        });
    });
});

//保存医院信息
app.post('/saveHospitalInfo', function (req,res) {
    console.log(req.body);
    var DateSql = 'update `hospital_info` set `hospName` = "' + req.body.s_name + '" , `hospAddress` = "' + req.body.s_address + '", ' +
        '`hospPhone` = "' + req.body.s_phone + '" , `hospIntroduction` = "' + req.body.s_introduction + '" , `hospHonor` = "' + req.body.s_honor + '" , `hospFeature` = "' + req.body.s_feature + '";';
    connection.query(DateSql, function (err, result) {
        if (err) {
            res.send({
                code:500,
                msg:'保存失败!'
            });
            return;
        }
        res.send({
            code:200,
            msg:'保存成功'
        });
    });
});

//更新科室显示状态
app.post('/ifDepartmentShow', function (req,res) {
    console.log(req.body);
    var DateSql = 'update `department_list` set ifshow = ' + req.body.ifshow + ' where department = "' + req.body.department + '";';
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

//获取统计数据
app.post('/countAppointment', function (req,res) {
    var data = {};
    getTodayAppoint();

    function getTodayAppoint() {
        var DateSql = "select * from `appointment_list` al where al.`date` = DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`patientid` is not null";
        connection.query(DateSql, function (err, result) {
            if (err) {
                console.log('获取今日预约失败');
                return false;
            }
            data.todayAppoint = result;
            getMonthAppoint();
        });
    }

    function getMonthAppoint() {
        var DateSql = "select * from `appointment_list` al where al.`date` <= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(),INTERVAL 30 DAY),'%Y-%m-%d') and al.`patientid` is not null";
        connection.query(DateSql, function (err, result) {
            if (err) {
                console.log('获取今日预约失败');
                return false;
            }
            data.monthAppoint = result;
            getWeekAppoint();
        });
    }

    function getWeekAppoint() {
        var DateSql = "select * from `appointment_list` al where al.`date` <= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(),INTERVAL 7 DAY),'%Y-%m-%d') and al.`patientid` is not null";
        connection.query(DateSql, function (err, result) {
            if (err) {
                console.log('获取今日预约失败');
                return false;
            }
            data.weekAppoint = result;
            getTodayCount();
        });
    }

    function getTodayCount() {
        var DateSql = "select al.`time`, count(al.`id`) as num from `appointment_list`al where al.`date` = DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`status` != '未完成' group by al.`time`";
        connection.query(DateSql, function (err, result) {
            if (err) {
                console.log('获取今日预约失败');
                return false;
            }
            data.todayCount = result;
            getMonthCount();
        });
    }

    function getMonthCount() {
        var DateSql = "select al.`time`, count(al.`id`) as num from `appointment_list`al where al.`date` <= DATE_FORMAT(CURRENT_DATE(),'%Y-%m-%d') and al.`date` >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(),INTERVAL 30 DAY),'%Y-%m-%d')  and al.`status` != '未完成' group by al.`time`";
        connection.query(DateSql, function (err, result) {
            if (err) {
                console.log('获取今日预约失败');
                return false;
            }
            data.monthCount = result;
            res.send({
                code:200,
                msg:'操作成功',
                data:data
            });
        });
    }

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
//    var dateArr = ['2018-5-22','2018-5-23','2018-5-24','2018-5-25','2018-5-26','2018-5-27','2018-5-28','2018-5-29','2018-5-30','2018-5-31','2018-6-1','2018-6-2','2018-6-3',
//        '2018-6-4','2018-6-5','2018-6-6','2018-6-7','2018-6-8','2018-6-9','2018-6-10','2018-6-11','2018-6-12','2018-6-13','2018-6-14','2018-6-15','2018-6-16','2018-6-17',
//        '2018-6-18','2018-6-19','2018-6-20','2018-6-21','2018-6-22'];
//    var room = ['101','102','103'];
//    for(var i = 0 ; i < 500 ; i++ ) {
//        var ra = Math.floor(Math.random() * (doctoridArr.length));
//
//        //var id = times + i;
//        var doctorid = +doctoridArr[ra];
//        var id = doctorid + (Math.random() * 1000000).toFixed(0);
//        //console.log("doctorid",doctorid)
//        var date = dateArr[Math.floor(Math.random() * dateArr.length)];
//        var time = ['8:00 ~ 9:00','9:00 ~ 10:00','10:00 ~ 11:00','14:00 ~ 15:00','15:00 ~ 16:00','16:00 ~ 17:00'];
//        var address = departmentArr[ra] + room[Math.floor(Math.random() * 3)];
//        var department = departmentArr[ra];
//        var status = '未完成';
//        var sql = "insert into appointment_list (id,doctorid,date,time,address,department,status) values (" + id + "," + doctorid + ",'" + date + "','" + time[Math.floor(Math.random() * 6)]
//            + "','" + address + "','" + department + "','" + status + "')";
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