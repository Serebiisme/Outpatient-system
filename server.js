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
//var username = 'de50909b3dbc4aa188008c2d83521452';//用户AK
//var password = 'b1d5c3320d4e4ca3af97bc822ad8f688';//用户SK
//var db_host = 'sqld.duapp.com';
//var db_port = 4050;
//var db_name = 'YJZUfgGUYQydXaBGTkRC';
//var option = {
//    host: db_host,
//    port: db_port,
//    user: username,
//    password: password,
//    database: db_name
//};
//var connection = mysql.createConnection(option);
//connection.connect();//连接数据库

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

app.post('/test',function (req,res){
    //var result = null;
    superagent
        .get('https://weixin.guizhou12320.org.cn/gzappv2/index.php/Index/getArticleList')
        .send({
            catid: '8',
            pagenum: '1',
            mode: 'knowledge'
        })
        .set({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=lceddnscvj2qmk2jt7qbh4t537'
        })
        .accept('application/json')
        .end(function(err, response) {
            if (err) {
                //do something
                console.log('请求失败!');
                console.log(err);
            } else {
                //do something
                console.log('请求成功!');
                //console.log(res);
                console.log(JSON.parse(response.text));
                res.send(JSON.parse(response.text));
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