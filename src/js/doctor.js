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
app.controller('settingController',function($scope,$location){
    console.log('setting');

    //退出登录
    $scope.logout = function(){
        window.client = {};
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
    var d = new Date(),dm = new Date();
        dm.setMonth(d.getMonth() + 1);
    $scope.minDate = d.format("yyyy-MM-dd");
    $scope.maxDate = dm.format("yyyy-MM-dd");

    $("#date-picker").calendar({
        value: [$scope.minDate],
        minDate: $scope.minDate,
        maxDate: $scope.maxDate
    });

    $scope.submitappointment = function () {
        var a_info = getFormToJson('#appointmentform');
        console.log(a_info);

        if(a_info.address == ""){
            zalert('地址不能为空!');
            return false;
        }

        zpost('addappointment',{
            doctorid:window.id,
            date:a_info['date'],
            time:a_info['time'],
            address:a_info['address'],
            number:a_info['number'],
            department:window.department
        },function(data){
            zinfo(data.msg);
        })
    };

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