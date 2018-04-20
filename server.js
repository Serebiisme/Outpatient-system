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
    database: db_name
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
    var DateSql = "INSERT INTO patient_login ( id, name, gender, passward, birthday, telephone ) VALUES ( "+ req.body.p_id +", '"+ req.body.p_name+"','"+ req.body.p_gender+"','"+ req.body.p_passward+"','"+ req.body.p_birthday+"','"+ req.body.p_telephone+"');";

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
    var DateSql = "INSERT INTO doctor_login ( id, name, gender, passward, department, telephone ) VALUES ( "+ req.body.d_id +", '"+ req.body.d_name+"','"+ req.body.d_gender+"','"+ req.body.d_passward+"','"+ req.body.d_department+"','"+ req.body.d_telephone+"');";
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
app.post('/getBackPassward',function(req,res){
    var identity = {
        '患者':'patient_login',
        '医生':'doctor_login'
    },
        randomPassward = (Math.random() * 1000000).toFixed(0);

    console.log(req.body) ;
    var DateSql = "UPDATE " + identity[req.body.f_identity] + " SET passward='" + randomPassward + "' WHERE  id='"+ req.body.f_id +"' AND telephone='" + req.body.f_telephone + "';";
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
            passward:randomPassward
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

        if (result[0] && result[0].passward == req.body.passward){
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

/**
 * @type action end
 */
var server = app.listen(9999, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("访问地址为 http://localhost:9999");

});