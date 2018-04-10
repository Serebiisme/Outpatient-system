/**
 * 路由配置
 */
var app = angular.module('myApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
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
        .otherwise({redirectTo:'/'});
}]);
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
app.controller('myintroController',function($scope){
    console.log('myintro');

    $.init();//放最后
});
/**
 * 健康咨询页
 */
app.controller('informationController',function($scope){
   console.log('information');

    $.init();//放最后
});
/**
 * 关注医生页
 */
app.controller('concernController',function($scope){
   console.log('concern');

    $.init();
});