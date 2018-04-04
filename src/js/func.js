/**
 * 路由配置
 */

angular.module('routingDemoApp',['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl: '/html/index.html',
                controller: 'indexController'
            })
            .when('/hospital',{
                templateUrl: '/html/hospital.html',
                controller: 'hospitalController'
            })
            //.when('/printers',{
            //    templateUrl: 'embedded.home.html',
            //    controller: 'HomeController'
            //})
            .otherwise({redirectTo:'/'});
    }]);


/**
 * 首页
 */
var app = angular.module('myApp', []);
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log(1);
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
    console.log(2);
    $scope.stretchFlag = false;

    $scope.toggleStretch = function (){
        $scope.stretchFlag = !$scope.stretchFlag;
    };

});