/**
 * Created by apple on 2018/4/2.
 */

/**
 * angular module 数据模型处理
 */
//首页
var app = angular.module('myApp', []);
app.controller('indexController', function($scope,$timeout,$compile) {
    console.log(1);
    $scope.arr = ['1','2','3'];


    $(document).bind('refresh',function(data){
        console.log(111);
        var args = data._args;
        console.log(args);
        $scope.$apply();
    });

});

//医院页
app.controller('hospitalController',function($scope,$compile){
    console.log(2);
    $scope.stretchFlag = false;

    $scope.toggleStretch = function (){
        $scope.stretchFlag = !$scope.stretchFlag;
    };



    $(document).bind('refresh',function(data){
        var args = data._args;
        console.log(args);
        $scope.$apply();
    });
});

/**
 * zepto module DOM操作处理
 */
//首页
$(function(){

    var bts = {
        index:!!0,
        hospital:!!0
    };

    //初始化编译angular
    //angular.bootstrap($('#index')[0], ['myApp']);

    //初始化banner
    //$(".swiper-container").swiper({
    //    autoplay : 3000,
    //    pagination : '.swiper-pagination',
    //    loop: true
    //});

    //首页初始化操作
    $(document).on("pageInit","#index", function(e, pageId, $page) {
        console.log("index.htm");

        //初始化banner
        $(".swiper-container").swiper({
            autoplay : 3000,
            pagination : '.swiper-pagination',
            loop: true
        });



        if (!bts.index){
            //编译angular
            angular.bootstrap($('#index')[0], ['myApp']);
            bts.index = !bts.index;
        } else {
            //刷新编译
            $(document).trigger('refresh');
        }
    });

    $('#index').trigger('pageInit');

    //医院页初始化操作
    $(document).on("pageInit","#hospital", function(e, pageId, $page) {
        console.log("hospitam.htm");

        if (!bts.hospital){
            //编译angular
            angular.bootstrap($("#hospital")[0], ['myApp']);
            bts.hospital = !bts.hospital;
        } else {
            $(document).trigger('refresh');
        }

    });

    //功能区路由
    //$(document).on('click','#list .list-item',function(){
    //    var routeTarget = this.dataset.target;
    //    $.router.load(routeTarget);
    //})
});