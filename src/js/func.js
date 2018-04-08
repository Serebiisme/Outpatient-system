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
        .otherwise({redirectTo:'/'});
}]);
/**
 * 首页
 */
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log('index');
    $.init();

    $scope.arr = ['1','2','3'];


    //初始化banner
    $(".swiper-container").swiper({
        autoplay : 3000,
        pagination : '.swiper-pagination',
        loop: true
    });
});
/**
 * 医院页
 */
app.controller('hospitalController',function($scope,$compile){
    console.log('hospital');
    $.init();

    $scope.stretchFlag = false;

    $scope.toggleStretch = function (){
        $scope.stretchFlag = !$scope.stretchFlag;
    };

});
/**
 * 预约挂号页
 */
app.controller('appointmentController',function($scope){
    console.log('appointment');
    $.init();

});