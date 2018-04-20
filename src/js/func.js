/**
 * 路由配置
 */
var app = angular.module('myApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login',{
            templateUrl:'login.html',
            controller:'loginController'
        })
        .when('/index',{
            templateUrl:'html/index.html',
            controller:'indexController'
        })
        .when('/hospital',{
            templateUrl: 'html/hospital.html',
            controller: 'hospitalController'
        })
        .when('/appointment',{
            templateUrl: 'html/appointment.html',
            controller:'appointmentController'
        })
        .when('/search',{
            templateUrl:'html/search.html',
            controller:'searchController'
        })
        .when('/myintro',{
            templateUrl:'html/myintro.html',
            controller:'myintroController'
        })
        .when('/information',{
            templateUrl:'html/information.html',
            controller:'informationController'
        })
        .when('/concern',{
            templateUrl:'html/concern.html',
            controller:'concernController'
        })
        .when('/informationDetail',{
            templateUrl:'html/informationDetail.html',
            controller:'informationDetailController'
        })
        .when('/myintrodetail',{
            templateUrl:'html/myintrodetail.html',
            controller:'myintrodetailController'
        })
        .otherwise({redirectTo:'/login'});
}]);
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

        if (l_info.passward == "") {
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
                        console.log('go to doctor.html');
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

        if (p_info.p_passward == "") {
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

        if (d_info.d_passward == "") {
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

    $scope.getBackPassward = function(){
        var f_info = getFormToJson('#f_info');
        console.log(f_info);

        zpost('getBackPassward',f_info,function(data){
            if(data.code == '200'){
                zalert('您的密码已重置,新密码为' + data.passward,'短信提示', function () {
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
 * 首页
 */
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log('index');
    $scope.arr = ['1','2','3'];


    //初始化banner
    $(".swiper-container").swiper({
        autoplay : 3000,
        pagination : '.swiper-pagination',
        loop: true
    });

    $.init();//放最后
});
/**
 * 医院页
 */
app.controller('hospitalController',function($scope,$compile){
    console.log('hospital');

    $scope.hospital = {
        '医院简介':{
            stretchFlag:false,
            content:'某某市妇幼保健院是一所政府公立医院，同时也是某某市妇女儿童医院、某某市各县市区新农合定点医院、医保定点医院、某某医学院教学医院。医院拥有职工280余人（其中专业技术人员179人）、床位155张、各种大型医疗设备40余台件，是集医疗、保健、科研、教学为一体的现代化的三级乙等妇幼保健院。医院设临床部和保健部。临床部设有妇科、产科、儿科、新生儿科、无痛人流科、乳腺科、优生优育科、生殖保健科、内科、外科等10余个临床科室及B超室、放射科、输血科、药械科、检验科、心电图室等10余个医技科室，保健部设基层保健科、妇女保健科、儿童保健科等。 某某市妇幼保健院将始终坚持“患者至上，质量第一”的服务理念，秉承“低廉收费，优质服务”的办院宗旨，为广大市民朋友提供优质高效的医疗保健服务，为某某市妇幼保健事业做出更大的贡献。'
        },
        '医院荣誉':{
            stretchFlag:false,
            content:'1988年某某市政府命名为“某某市妇产医院”； 1995年获卫生部“二级甲等医院”和“爱婴医院”； 1999年医院荣获“省级文明单位”； 2000年荣获“某某省卫生行业文明示范”单位； 2002年获某某省首批“百姓放心医院”； 2005年获“某某省消费者放心医院”、“公安法医创伤医院”； 2006年获“某某省护理工作先进集体”； 2007年获“某某省先进集体”； 2007年获全省卫生系统“创佳评差”竞赛活动最佳单位 2009年荣获某某省诚信单位。 2010年被某某省中医管理局授予“三级甲等中西医结合医院” 2011年荣获“最受市民信赖的医疗机构”； 2011年荣获某某高校巾帼建功标兵岗。 2011年荣获某某市卫生工作先进单位。 2012年被国家中医药管理局授予“三级甲等中西医结合医院” 2014年～2015年被市卫生局评为“行风建设先进集体” 获全市卫生系统“创佳选优评差”竞赛活动先进单位 2016年被省教育工委评为“先进基层党组织”'
        },
        '医院特色':{
            stretchFlag:false,
            content:'医院现有国家级、省级重点建设专学科17个，省级二级实验室1个，国医堂、名老中医工作室5个，国家级师承导师、省级名老中医殷克敬教授工作室1个。重点专科和学科分布在心血管病、脑病、糖尿病、血液病、肿瘤、脾胃病、肺病、妇产科、重症医学、治未病、中医康复学、介入治疗、新生儿科、儿科、儿保科、乳腺科、骨伤骨病、心脏外科和泌尿外科等重大疑难疾病和社会急需的专业，并开设国医堂和名老中医工作室5个，名老中医传承工作室1个，包括国医大师张学文教授和郭诚杰教授等一批全国著名中医药专家长期座诊和查房。妇产学科在某某省医疗卫生系统中居于前列，是卫计委指定的全省危重孕产妇救治与转诊中心定点医院，被誉为本地区的“母婴健康的保护神”。'
        }
    };

    $scope.toggleStretch = function (){
        this.val.stretchFlag = !this.val.stretchFlag;
    };

    $.init();//放最后
});
/**
 * 预约挂号页
 */
app.controller('appointmentController',function($scope){
    console.log('appointment');

    $.init();//放最后
});

/**
 * 医生搜索页面
 */
app.controller('searchController',function($scope){
    console.log('search');

    $.init();//放最后
});
/**
 * 个人信息页面
 */
app.controller('myintroController',function($scope,$location){
    console.log('myintro');
    $scope.myintro = window.client;

    //退出登录
    $scope.logout = function(){
        $location.url('login');
        //history.go(1-history.length-1);
    };

    $.init();//放最后
});

/**
 * 我的信息
 */
app.controller('myintrodetailController',function($scope){
    console.log('myintrodetail');
    $scope.myintro = {
        '姓名':window.client.name,
        '性别':window.client.gender,
        '生日':window.client.birthday,
        '手机':window.client.telephone,
        '医保编号':window.client.id
    };

    $.init();
});

/**
 * 健康咨询页
 */
app.controller('informationController',function($scope,$location){
    console.log('information');

    $scope.tabIndex = !!0;
    $scope.lifeList = [];
    $scope.busnessList = [];
    $scope.ifload = 0;
    $scope.lifeStartNum = 1;
    $scope.busnessStartNum = 1;

    //tab切换
    $scope.switchTab = function(){
        $scope.tabIndex = !$scope.tabIndex;
        $.refreshScroller();
    };

    //跳转详情页
    $scope.goToInformationDetail = function(){
        var id = this.item.id,
            path = '/informationDetail?id=' + id;
        $location.url(path);
    };

    // 添加'refresh'监听器
    $(document).on('refresh', '.pull-to-refresh-content',function(e) {
        $scope.ifload = 0;
        $scope.lifeStartNum = 0;
        $scope.busnessStartNum = 0;

        console.log('loadInformationList');

        //初始化生活资讯
        $.ajax({
            type: 'POST',
            url: $lifeArticleUrl + $scope.lifeStartNum,
            dataType: 'jsonp',
            timeout: 7500,
            success: function(data){
                $scope.lifeList = data.body;
                $scope.ifload < 2 && $scope.ifload++;
                console.log('A:' + $scope.ifload);
                $scope.$apply();
            },
            error: function(xhr, type){
                zalert('加载失败,请重新加载...!');
                $.pullToRefreshDone('.pull-to-refresh-content');
            }
        });

        //初始化行业资讯
        $.ajax({
            type: 'POST',
            url: $busnessArticleUrl + $scope.busnessStartNum,
            dataType: 'jsonp',
            timeout: 7500,
            success: function(data){
                $scope.busnessList = data.body;
                $scope.ifload < 2 && $scope.ifload++;
                console.log('B:' + $scope.ifload);
                $scope.$apply();
            },
            error: function(xhr, type){
                zalert('加载失败,请重新加载...!');
                $.pullToRefreshDone('.pull-to-refresh-content');
            }
        });

    });

    //无限滚动
    var loading = false;
    $(document).on('infinite', '.infinite-scroll-bottom',function() {

        // 如果正在加载，则退出
        if (loading) return;

        //tabindex - false : life , true : busnes
        if ($scope.tabIndex){
            console.log('load more busness article');
            $scope.busnessStartNum++;
            $.ajax({
                type: 'POST',
                url: $busnessArticleUrl + $scope.busnessStartNum,
                dataType: 'jsonp',
                timeout: 7500,
                success: function(data){
                    loading = !loading;

                    data.body.length == 0 && $.detachInfiniteScroll('.infinite-scroll-bottom');

                    $scope.busnessList = $scope.busnessList.concat(data.body);
                    $scope.$apply();
                    $.refreshScroller();
                },
                error: function(xhr, type){
                    zalert('加载失败,请重新加载...!');
                    $.refreshScroller();
                }
            });
            loading = !loading;

        } else {
            console.log('load more life article');
            $scope.lifeStartNum = $scope.lifeStartNum + 1;
            console.log( $scope.lifeStartNum);
            $.ajax({
                type: 'POST',
                url: $lifeArticleUrl + $scope.lifeStartNum,
                dataType: 'jsonp',
                timeout: 7500,
                success: function(data){
                    loading = !loading;

                    data.body.length == 0 && $.detachInfiniteScroll('.infinite-scroll-bottom');

                    $scope.lifeList = $scope.lifeList.concat(data.body);
                    $scope.$apply();
                    $.refreshScroller();
                },
                error: function(xhr, type){
                    zalert('加载失败,请重新加载...!');

                }
            });
            loading = !loading;
        }

        console.log('刷新');
        $.refreshScroller();
    });


    $scope.$watch("ifload",function(newValue, oldValue) {
        // 加载完毕需要重置
        newValue == 2 && $.pullToRefreshDone('.pull-to-refresh-content');
    });

    $.init();//放最后

    //初始化触发;
    $('.pull-to-refresh-content').trigger('refresh');
});
/**
 * 资讯详情页
 */
app.controller('informationDetailController',function($scope,$location){
    console.log('informationDetail');

    $scope.id = $location.search().id;
    $scope.article = {};

    //初始化资讯详情
    $.ajax({
        type: 'POST',
        url: $articleDetailUrl+ $scope.id +'&pubver=1',
        dataType: 'jsonp',
        timeout: 7500,
        success: function(data){
            $scope.article = data.body;
            $scope.$apply();
        },
        error: function(xhr, type){
            alert('Ajax error!')
        }
    });

    $.init();//放最后
});
/**
 * 关注医生页
 */
app.controller('concernController',function($scope){
   console.log('concern');

    $.init();
});