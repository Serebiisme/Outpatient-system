/**
 * Created by apple on 2018/4/8.
 */

var app = angular.module('myApp', ['ngRoute']);

/**
 * 登录
 */
app.controller('loginController',function($scope,$timeout,$location){
    console.log('login');

    //身份选择
    $(document).on('change','[name=identity]', function () {
        var identity = $('[name=identity]').val();
        switch (identity){
            case '患者':
                $('[name=id]').attr('placeholder','请输入医保号');
                break;
            case '医生':
                $('[name=id]').attr('placeholder','请输入医生编号');
                break;
            case '管理员':
                $('[name=id]').attr('placeholder','请输入管理员账号');
                break;
        }
    });

    //身份选择
    $(document).on('change','[name=f_identity]', function () {
        var identity = $('[name=f_identity]').val();
        console.log('change');
        switch (identity){
            case '患者':
                $('[name=f_id]').attr('placeholder','请输入医保号');
                break;
            case '医生':
                $('[name=f_id]').attr('placeholder','请输入医生编号');
                break;
        }
    });

    //登录
    $scope.clientLogin = function(){
        var l_info = getFormToJson('#l_info');

        if (l_info.id == "") {
            zalert("账号不能为空!");
            return false;
        }

        if (l_info.password == "") {
            zalert("密码不能为空!");
            return false;
        }

        zpost('login',l_info, function (data) {
            console.log('登录');
            if (data.code == '200'){
                window.client = data.client;

                switch (l_info.identity){
                    case '患者':
                        $location.url('/index').replace();
                        $scope.$apply();//必要
                        break;
                    case '医生':
                        $location.url('/doctor').replace();
                        $scope.$apply();//必要
                        break;
                    case '管理员':
                        console.log('go to manager.html');
                        break;
                }
            } else {
                zinfo(data.msg);
            }
        });

    };

    //注册页面
    $scope.openRegister = function(){
        $.modal({
            title:  '注册身份选择',
            text: '提示:请您根据自身需求选择需要注册的账号类型,医生身份仅限具备医师资格证的人员注册.',
            verticalButtons: true,
            buttons: [
                {
                    text: '患者',
                    onClick: function() {
                        $.popup('.popup-register');
                    }
                },
                {
                    text: '医生',
                    onClick: function() {
                        $.popup('.popup-doctor');
                    }
                }
            ]
        })
    };

    //用户注册
    $scope.registerPatient = function(){

        var p_info = getFormToJson('#p_info');

        if (p_info.p_name == "") {
            zalert("名字不能为空!");
            return false;
        }

        if(!isCorrectName(p_info.p_name)){
            zalert("请输入10或10个以内汉字.");
            return false;
        }

        if (p_info.p_password == "") {
            zalert("密码不能为空!");
            return false;
        }

        if (p_info.p_birthday == "") {
            zalert("请填写生日!");
            return false;
        }

        if (p_info.p_telephone == "") {
            zalert("手机号不能为空!");
            return false;
        }

        if (!isMobile(p_info.p_telephone)) {
            zalert("请填写正确的手机号！");
            return false;
        }

        if (p_info.p_id == "") {
            zalert("编号不能为空!");
            return false;
        }

        zpost('registerPatient',p_info,function(data){
            //zalert(data.msg,'',function(){
            //    $.closeModal();
            //});
            zinfo(data.msg);
            data.code == '200' && $timeout(function(){
                $.closeModal();
            },2100);

        });

    };

    //用户取消注册
    $scope.cancelPatient = function(){
        $('#p_info')[0].reset();
    };

    //医生注册
    $scope.registerDoctor = function(){

        var d_info = getFormToJson('#d_info');

        if (d_info.d_name == "") {
            zalert("名字不能为空!");
            return false;
        }

        if(!isCorrectName(d_info.d_name)){
            zalert("请输入10或10个以内汉字.");
            return false;
        }

        if (d_info.d_password == "") {
            zalert("密码不能为空!");
            return false;
        }

        if (d_info.d_telephone == "") {
            zalert("手机号不能为空!");
            return false;
        }

        if (!isMobile(d_info.d_telephone)) {
            zalert("请填写正确的手机号！");
            return false;
        }

        if (d_info.d_id == "") {
            zalert("编号号不能为空!");
            return false;
        }

        zpost('registerDoctor',d_info,function(data){
            zinfo(data.msg);
            data.code == '200' && $timeout(function(){
                $.closeModal();
            },2100);

        });
    };

    //医生取消注册
    $scope.cancelDoctor = function(){
        $('#d_info')[0].reset();
    };

    //科室选择
    $("[name=d_department]").picker({
        toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button><h1 class="title" style="background: transparent;color: #3d4145;">请选择称呼</h1></header>',
        cols: [
            {
                textAlign: 'center',
                values: ['内科','外科','儿科','妇科','眼科','耳鼻喉科','口腔科','皮肤科','中医科','针灸推拿科','心理咨询室']
            }
        ]
    });

    //打开密码找回页
    $scope.openForget = function(){
        $.popup('.popup-forget');
    };

    //取消忘记密码页
    $scope.cancelForget = function(){
        $('#f_info')[0].reset();
    };

    $scope.getBackpassword = function(){
        var f_info = getFormToJson('#f_info');
        console.log(f_info);

        zpost('getBackpassword',f_info,function(data){
            if(data.code == '200'){
                zalert('您的密码已重置,新密码为' + data.password,'短信提示', function () {
                    $.closeModal();
                })
            } else {
                zinfo(data.msg);
            }
        });
    };

    $.init();
});

/**
 * 帮助与反馈 版本
 */
app.controller('helpAndVersionController',function($scope,$location){
    console.log('help and feedback , version');
    $scope.appType = $location.search().type;
    console.log($scope.appType);
    $.init();
});

//资讯根链接
var $lifeArticleUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticlelist?catid=6&onlyorgan=1&organid=1&page=',
    $busnessArticleUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticlelist?catid=5&onlyorgan=1&organid=1&page=',
    $articleDetailUrl = 'https://yypt.ngarihealth.com/api.php/App/getArticle?aid=';

//用户info
var client = null;

//页面回退
$(document).on('click','.back',function(){
    history.go(-1);
});

//页面跳转
$(document).on('click','.item-link',function(){
    var href = $(this).attr('href');
    href && (location.hash = href);
});

//LocalStorage
app.factory('$locals', ['$window', function ($window) {
    return {        //存储单个属性
        set: function (key, value) {
            $window.localStorage[key] = value;
        },        //读取单个属性
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
        }

    }
}]);