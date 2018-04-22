/**
 * Created by apple on 2018/4/21.
 */


/**
 * 首页
 */
app.controller('doctorController',function($scope){
    console.log('doctor');

    //初始化banner
    $(".swiper-container").swiper({
        autoplay : 3000,
        pagination : '.swiper-pagination',
        loop: true
    });

    $.init();
});
/**
 * 预约管理
 */
app.controller('managerController',function($scope){
    console.log('manager');

    $.init();
});
/**
 * 设置页面
 */
app.controller('settingController',function($scope){
    console.log('setting');

    //退出登录
    $scope.logout = function(){
        $location.url('login');
        //history.go(1-history.length-1);
    };

    $.init();
});
/**
 * 新增预约
 */
app.controller('addappointmentController',function($scope){
    console.log('addappointment');

    $.init();
});
/**
 * 预约日历
 */
app.controller('calendarController',function($scope){
    console.log('calendar');

    $.init();
});
/**
 * 健康教育
 */
app.controller('healtheducationController',function($scope){
    console.log('healtheducation');

    $.init();
});